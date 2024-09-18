//get glowrify orders
select o.id, o.order_number, oi."name" 
from "Orders" o left join "OrderItems" oi on oi.order_id = o.id 
where o.status = 'Confirmed' 
and o.assigned_at >= '2024-09-12 00:00:00.000 +05:00' 
and o.assigned_at <= '2024-09-12 23:59:59.999 +05:00' 
and o.chanel_id in (4) and o.brand_id in (1);

//get sukooon orders
select o.id, o.order_number, oi."name" 
from "Orders" o left join "OrderItems" oi on oi.order_id = o.id 
where o.status = 'Confirmed' 
and o.assigned_at >= '2024-09-12 00:00:00.000 +05:00' 
and o.assigned_at <= '2024-09-12 23:59:59.999 +05:00' 
and o.chanel_id in (71) and o.brand_id in (35);

update "OrderItems"
set name = 'EYELIGHT 10ML' 
where name = 'Eyelight - Eliminates Dark Circles & Puffy Eyes'
 or name = 'Eyelight 10ML'
 or name = 'Eyelight - Dark Circles Removal Serum' 
 or name = 'Eyelight | Eliminate Dark Circles & Puffy Eyes - ELT - Sell - 10ML'
 or name = 'Eyelight - Eliminates Dark Circles Around Eyes & Puffy Eyes';

update "OrderItems"
set name = 'NERVE ON 30ML' 
where name = 'NERVE ON | For Sciatica & Neuropathic Pain - NRV FB - 30 ML'
 or name = 'NERVE ON |For Diabetic Neuropathy| Sciatica Pain Treatment - 30 ML' 
 or name = 'NERVE ON | For Sciatica & Neuropathic Pain - NRV FB - 30 ML' ;

update "OrderItems"
set name = 'NERVE ON 50ML' 
where name = 'NERVE ON | For Sciatica & Neuropathic Pain - NRV FB - 50 ML'
 or name = 'NERVE ON |For Diabetic Neuropathy| Sciatica Pain Treatment - 50 ML';

update "OrderItems"
set name = 'NERVE ON 10ML' 
where name = 'NERVE ON | For Sciatica & Neuropathic Pain - NRV FB - 10 ML'
 or name = 'NERVE ON |For Diabetic Neuropathy| Sciatica Pain Treatment - 10 ML';

update "OrderItems"
set name = 'JOINT ON 30ML' 
where name = 'JOINT ON | For Joints & Knee Pain | Joints Pain Relief - JNT - 30 ML'
or name =  'JOINT ON | For Joint Pain & Back Pain - 30 ML';

update "OrderItems"
set name = 'JOINT ON 50ML' 
where name = 'JOINT ON | For Joints & Knee Pain | Joints Pain Relief - JNT - 50 ML' 
or name = 'JOINT ON | For Joint Pain & Back Pain - 50 ML';

update "OrderItems"
set name = 'JOINT ON 10ML' 
where name = 'JOINT ON | For Joints & Knee Pain | Joints Pain Relief - JNT - 10 ML'
or name  = 'JOINT ON | For Joint Pain & Back Pain - 10 ML';

update "OrderItems"
set name = 'JOINT ON 100ML' 
where name  = 'JOINT ON | For Joints & Knee Pain | Joints Pain Relief - JNT - 100 ML';

update "OrderItems"
set name = 'De Piles 30ML' 
where name = 'De-Piles Instant Comfort From Hemorrhoids & Anorectal Issue';

update "OrderItems"
set name = 'NIGHT ON 30ML' 
where name = 'NIGHT ON | For Insomnia | For Sleep apnea and Better Sleep - 30 ML';

update "OrderItems"
set name = 'LAVENDER 10ML' 
where name = 'LAVENDER | Essential Oil - LVD - 10 ML';

