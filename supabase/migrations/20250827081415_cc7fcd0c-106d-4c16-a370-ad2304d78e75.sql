INSERT INTO admin_users (user_id, role) 
SELECT auth.uid(), 'super_admin' 
WHERE auth.uid() IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());