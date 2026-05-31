
select * from users
select * from user_profiles
select * from user_addresses 

select * from restaurants
select * from restaurant_addresses

select * from drivers
select * from delivery_assignments

select * from menu_items
select * from menu_categories

select * from orders
select * from order_items

-- drop table order_status_history

-- select c.name, i.name from menu_categories c 
-- inner join menu_items i
-- on i.category_id = c.id

-- alter table drivers
-- alter column status type bool

-- ALTER TABLE order_items
-- DROP CONSTRAINT order_items_menu_item_id_fkey;

-- alter table order_items
-- drop column special_instructions

-- alter table order_items
-- add column items_order text

-- update menu_categories
-- values name = 'Breakfast'
-- where restaurant_id

-- alter table menu_categories 
-- drop column image_url

-- drop table driver_locations

-- alter table restaurants
-- alter column cuisine type text

-- select * from users where id = 1

-- truncate table restaurants, restaurant_addresses restart

-- select id from users where email = 'kaushal21gs@gmail.com'

-- alter table user_profiles
-- alter column gender type varchar(4)

-- insert into user_addresses(user_id, address_line, city, state, lat, lng)
-- values (1, 'navayuga', 'Hyderabad', 'Telangana', 45.12345678, 89.98765432)

-- alter table restaurants
-- alter column phone type text

-- drop table restaurant_hours

-- Use it very carefully in production
-- TRUNCATE TABLE
delivery_assignments,
driver_documents,
driver_locations,
drivers,
menu_categories,
menu_items,
order_items,
order_status_history,
orders,
payments,
restaurant_addresses,
restaurant_hours,
restaurants,
user_addresses,
user_profiles,
users
RESTART IDENTITY CASCADE;