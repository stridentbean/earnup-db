# Run this script before importing data
# See link for more details https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'helloworld';
flush privileges;