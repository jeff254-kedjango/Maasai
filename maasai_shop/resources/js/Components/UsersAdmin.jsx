import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import styles from '../../css/components/UserAdmin.module.css'; // Import the CSS module

function UsersAdmin({ listOfUsers }) {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (userId, role) => {
    setLoading(true);
    router.post(`/users/${userId}/toggle-role`, { role }, {
      onFinish: () => setLoading(false),
    });
  };

  console.log(listOfUsers);

  return (
    <div className={styles.UsersAdminContainer}>
      <h1>Users List</h1>
      {loading && <p>Loading...</p>}
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.theadRowName}>Name</th>
            <th className={styles.theadRowEmail}>Email</th>
            <th className={styles.theadRowRoles}>Roles</th>
            <th className={styles.theadRowActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listOfUsers.map((user) => (
            <tr key={user.id} className={styles.tbodyRow}>
              <td className={styles.tbodyRowName}>{user.name}</td>
              <td className={styles.tbodyRowEmail}>{user.email}</td>
              <td className={styles.tbodyRowRoles}>{user.roles.map(role => role.name).join(', ')}</td>
              <td className={styles.tbodyRowActions}>
                {['admin', 'staff', 'customer'].map((role) => (
                  <label key={role} style={{ marginRight: '10px' }}>
                    <input
                      type="checkbox"
                      checked={user.roles.some(r => r.name === role)}
                      onChange={() => handleRoleChange(user.id, role)}
                      className={styles.checkbox}
                    />
                    {role}
                  </label>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersAdmin;