CREATE TABLE shopnum1_bindWXacoount
    (
      ID INT IDENTITY(1, 1)
             PRIMARY KEY ,
      memloginId NVARCHAR(50) NOT NULL ,
      wxOpenID VARCHAR(50) NOT NULL
    )
    go