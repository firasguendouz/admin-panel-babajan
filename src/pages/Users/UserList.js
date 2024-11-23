import './UserList.css';

import React, { useEffect, useState } from 'react';
import { deleteUser, fetchUsers } from '../../api/adminApi';

import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateFormatter';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          role: roleFilter,
          page,
          limit,
        };
        const response = await fetchUsers(params);
        setUsers(response.data.data);
        setTotalUsers(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [search, roleFilter, page, limit]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSearchChange = debounce((value) => setSearch(value), 500);

  const handleViewUser = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="user-list-container">
      <h2>User Management</h2>

      {/* Filters */}
      <div className="user-filters">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select onChange={(e) => setRoleFilter(e.target.value)} value={roleFilter}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.name?.firstName} {user.name?.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.role}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>User Details</h3>
            <p>
              <strong>Name:</strong> {selectedUser.name?.firstName} {selectedUser.name?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone || 'N/A'}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Created At:</strong> {formatDate(selectedUser.createdAt)}
            </p>
            <p>
              <strong>Last Login:</strong> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
            </p>
            <p>
              <strong>Active:</strong> {selectedUser.isActive ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Deleted:</strong> {selectedUser.isDeleted ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
