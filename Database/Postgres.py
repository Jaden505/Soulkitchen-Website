import psycopg2

def create_table():
    create = ''' CREATE TABLE images (
        name VARCHAR (255),
        image VARCHAR (255)
    );'''
    cursor.execute(create)
    connection.commit()
    print('created')

def del_table():
    dell = 'DROP TABLE second_table'
    cursor.execute(dell)
    connection.commit()
    print('deleted')

def insert():
    inn = "INSERT INTO images VALUES ('product1', 'iaf[wqvfpiqwfvq1782grqpifwauvf987vqpfuapfiuwaufbabwf89wqg972vrbajbcipuwp7q83vqpivpiuVEP78G7883pw');"
    cursor.execute(inn)
    connection.commit()
    print('inserted')

def retrieve():
    cursor.execute("""SELECT * FROM people
        WHERE id > 10
        AND name = 'Jaden';
    """)
    rett = cursor.fetchall()
    print(rett)

try:
    connection = psycopg2.connect(port="5432", database="WebshopDB")
    cursor = connection.cursor()
    print('Connection is open')

    insert()

except (Exception, psycopg2.Error) as error:
    print ("Error while connecting to PostgreSQL", error)

finally:
    #closing database connection.
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")
