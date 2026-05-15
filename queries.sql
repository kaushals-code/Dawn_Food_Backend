
select * from users
select * from user_profiles
select * from user_addresses 

select * from restaurants
select * from restaurant_addresses

select * from restaurant

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