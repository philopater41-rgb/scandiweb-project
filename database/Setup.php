<?php

require_once __DIR__ . '/../vendor/autoload.php';

Dotenv\Dotenv::createImmutable(dirname(__DIR__) . '/')->load();

class Setup
{
    /**
     * Create / re-create the database and tables.
     *
     * @return self
     */
    public function createDatabase(): self
    {
        try {
            // Get the database configurations.
            $config = $this->getDatabaseConfigurations();
            $dbname = $config['dbname'];

            // Connect to MySQL without specifying a database, so we can create a new one
            $pdo = $this->connect($config, true);

            // Ensure the SQL file exists
            $sqlFile = __DIR__ . '/main.sql';
            if (!file_exists($sqlFile)) {
                throw new Exception("SQL file not found: $sqlFile");
            }

            // Execute SQL script to create the database and tables
            $sql = file_get_contents($sqlFile);

			// Replace the placeholder in the SQL file with the actual database name
			$sql = str_replace('{{DB_NAME}}', $dbname, $sql);

            // Execute the modified SQL
            $pdo->exec($sql);

            echo "✅ Database and tables created successfully.\n";
        } catch (PDOException $e) {
            error_log("❌ Database error: " . $e->getMessage());
            throw new Exception("Database setup failed. Check logs for details.");
        } catch (Exception $e) {
            error_log("❌ Error: " . $e->getMessage());
            throw $e;
        }

        return $this;
    }

    /**
     * Get the database configurations.
     *
     * @return array
     */
    private function getDatabaseConfigurations(): array
    {
        return [
            'driver'   => $_ENV['DB_DRIVER'] ?? 'mysql',
            'host'     => $_ENV['DB_HOST'] ?? 'localhost',
            'port'     => $_ENV['DB_PORT'] ?? '3306',
            'dbname'   => $_ENV['DB_NAME'] ?? 'scandiweb',
            'username' => $_ENV['DB_USER'] ?? 'root',
            'password' => $_ENV['DB_PASSWORD'] ?? '',
            'options'  => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_CASE => PDO::CASE_NATURAL,
                PDO::ATTR_STRINGIFY_FETCHES => false,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
            ],
        ];
    }

    /**
     * Create a new database connection.
     *
     * @param array $config
     * @param bool $withoutDb Whether to connect without specifying a database.
     * @return \PDO
     */
    private function connect(array $config, bool $withoutDb = false): PDO
    {
        // Extract the array into variables
        extract($config);

        // Now you can use $driver, $host, $port, etc. directly
        $dsn = $this->generateDsn(
            $driver,
            $host,
            $port,
            $withoutDb ? null : $dbname ?? null
        );

        return new PDO(
            $dsn,
            $username,
            $password,
            $options
        );
    }

    /**
     * Generate the DSN string.
     *
     * @param string $driver
     * @param string $host
     * @param string $port
     * @param string|null $dbname
     * @return string
     */
    private function generateDsn(string $driver, string $host, string $port, ?string $dbname = null): string
    {
        $dsn = "$driver:host=$host;port=$port";

        if (isset($dbname)) {
            $dsn .= ";dbname=$dbname";
        }

        return $dsn;
    }
}

// Run the script
(new Setup())->createDatabase();
