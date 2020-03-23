const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: 'helloworld',
    database: 'testapp',
});

connection.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('Connected!');

    function parseLine(line) {
        const parts = [];

        let prevComma = 0;
        let insideQuote = false;

        // Replace non standard commas
        line = line.replace('，', ',');

        for (let i = 0; i < line.length; i++) {
            if ((line.charAt(i) === ',' && !insideQuote) || i === line.length - 1) {
                let part = line.substring(prevComma + 1, i);
                
                // Remove unneeded quotes from the beginning and end
                part = part.replace('"', '');

                // Escape special characters
                part = escape(part);

                parts.push(part);
                prevComma = i;
            } else if (line.charAt(i) === '"') {
                insideQuote = !insideQuote;
            }
        }

        return parts;
    }

    async function processLineByLine() {
        const fileStream = fs.createReadStream('AB_NYC_2019.csv');

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for await (const line of rl) {
            // Each line in input.txt will be successively available here as `line`.
            //console.log(`Line from file: ${line}`);

            const parts = parseLine(line);

            // Ignore columns that are missing data. Example '255476,"The BLUE OWL:'
            if (parts.length < 15) {
                console.log(line)
                skippedCount++;
                continue;
            }

            // Replace empty part with NULL for ints
            // hostId
            if (parts[2] === '') {
                part[2] = 'NULL';
            }

            // latitude
            if (parts[6] === '') {
                part[6] = 'NULL';
            } else {
                // Convert data issues like 40.720n63 to 40.72
                parts[6] = parseFloat(parts[6]);
            }

            // longitude
            if (parts[7] === '') {
                part[7] = 'NULL';
            } else {
                // Convert data issues like 40.720n63 to 40.72
                parts[7] = parseFloat(parts[7]);
            }

            // price
            if (parts[9] === '') {
                part[9] = 'NULL';
            }

            // minimumNights
            if (parts[10] === '') {
                part[10] = 'NULL';
            }

            // numberOfReviews
            if (parts[11] === '') {
                part[11] = 'NULL';
            }

            // lastReview, datetime
            if (parts[12] === '') {
                parts[12] = 'NULL';
            } else {
                // Add single quotes if not null
                parts[12] = `\'${parts[12]}\'`;
            }

            // reviewsPerMonth
            if (parts[13] === '') {
                parts[13] = 'NULL';
            }

            // availability
            if (parts[15] === '') {
                parts[15] = 'NULL';
            }

            try {
                // insert statment
                let sql = `INSERT INTO Properties(name, hostId, hostName, neighborhoodGroup, neighborhood, latitude, longitude, roomType, price, minimumNights, numberOfReviews, lastReview, reviewsPerMonth, calculatedHostListingCount, availability) 
                VALUES('${parts[1]}\', ${parts[2]}, \'${parts[3]}\', \'${parts[4]}\' , \'${parts[5]}\', ${parts[6]}, ${parts[7]}, \'${parts[8]}\', ${parts[9]}, ${parts[10]}, ${parts[11]}, ${parts[12]}, ${parts[13]}, ${parts[14]}, ${parts[15]})`;
    
                // execute the insert statment
                await connection.query(sql);
                successCount++;
            } catch (error) {
                //console.log(error);
                errorCount++;
            }
        }

        console.log(`SuccessCount: ${successCount}`);
        console.log(`ErrorCount: ${errorCount}`);
        console.log(`SkippedCount: ${skippedCount}`);
    }

    processLineByLine();
});