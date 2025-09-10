#!/bin/bash

# --- Load DB URL from .env.production ---
if [ ! -f .env.production ]; then
  echo ".env.production file not found!"
  exit 1
fi

# Extract DATABASE_URL from .env.production
DB_URL=$(grep -E '^DATABASE_URL=' .env.production | cut -d '=' -f2-)

if [ -z "$DB_URL" ]; then
  echo "DATABASE_URL not found in .env.production"
  exit 1
fi

# --- Ask for inputs ---
echo "Enter start date (YYYY-MM-DD): "
read START_DATE

echo "Enter end date (YYYY-MM-DD): "
read END_DATE

echo "Select order type:"
echo "1) confirmed"
echo "2) generated"
echo "3) delivered"
read TYPE

case $TYPE in
  1)
    ORDER_TYPE="confirmed"
    STATUS_LIST="'Confirmed','Booked','Booking Error','Delivered','Returned'"
    ;;
  2)
    ORDER_TYPE="generated"
    STATUS_LIST="'Assigned','Confirmed','No Pick','Cancel','Payment Pending','Booked','Booking Error','Delivered','Returned'"
    ;;
  3)
    ORDER_TYPE="delivered"
    STATUS_LIST="'Delivered'"
    ;;
  *)
    echo "Invalid option"
    exit 1
    ;;
esac

OUTPUT_FILE="${ORDER_TYPE}_orders_${START_DATE}-${END_DATE}.csv"

# --- SQL query ---
SQL="
  select
    o.order_number,
    c.first_name || ' ' || c.last_name as name,
    STRING_AGG(oi.name || '/' || oi.quantity , ', ') AS item,
    c.phone,
    a.address1 as address,
    a.city,
    dsa.name as courier,
    p.amount as payment,
    u.name as agent,
    o.total_price as amount,
    o.remarks,
    o.tags,
    o.status,
    o.assigned_at::date as date
  from \"Orders\" o
  left join \"OrderItems\" oi on oi.order_id = o.id
  left join \"Addresses\" a on a.order_id = o.id
  left join \"Customers\" c on o.customer_id = c.id
  left join \"DeliveryServiceAccounts\" dsa on o.delivery_account_id = dsa.id
  left join \"Users\" u on o.user_id = u.id
  left join \"Payments\" p on p.order_id = o.id
  where o.assigned_at::date between '${START_DATE}' and '${END_DATE}'
    and o.status in (${STATUS_LIST})
  group by o.order_number, c.first_name, c.last_name, c.phone, a.address1, a.city,
           dsa.name, p.amount, u.name, o.total_price, o.remarks, o.tags, o.status, o.assigned_at;
"

# --- Run query ---
echo "Exporting ${ORDER_TYPE} orders to ${OUTPUT_FILE} ..."
psql "$DB_URL" -c "$SQL" > "$OUTPUT_FILE"

echo "Done ✅"
