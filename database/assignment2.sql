--query 1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--query 2
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--query 3
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--query 4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--query 5
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory inv
INNER JOIN classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

--query 6
UPDATE inventory
SET inv_image = '/images/vehicles' || SUBSTRING(inv_image FROM POSITION('/' IN inv_image)),
    inv_thumbnail = '/images/vehicles' || SUBSTRING(inv_thumbnail FROM POSITION('/' IN inv_thumbnail));

