"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Pagination from "../components/Pagination"
import "../styles/AdminDashboard.css"

export default function AdminDashboard({ API_URL }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [currentTab, setCurrentTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setStats(response.data)
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Lỗi tải thống kê:", error.response?.data?.message || error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Đang tải bảng điều khiển quản trị...</div>

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Bảng điều khiển quản trị</h1>
        <p>Quản lý người dùng và nhà hàng</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentTab("dashboard")}
        >
          Tổng quan
        </button>
        <button className={`tab-btn ${currentTab === "users" ? "active" : ""}`} onClick={() => setCurrentTab("users")}>
          Người dùng
        </button>
        <button
          className={`tab-btn ${currentTab === "restaurants" ? "active" : ""}`}
          onClick={() => setCurrentTab("restaurants")}
        >
          Nhà hàng
        </button>
      </div>

      {currentTab === "dashboard" && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Tổng số người dùng</p>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-card">
            <h3>{stats.totalRestaurants}</h3>
            <p>Tổng số nhà hàng</p>
            <div className="stat-icon">🏪</div>
          </div>
          <div className="stat-card">
            <h3>{stats.totalOrders}</h3>
            <p>Tổng số đơn hàng</p>
            <div className="stat-icon">📋</div>
          </div>
          <div className="stat-card">
            <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue || 0)}</h3>
            <p>Tổng doanh thu</p>
            <div className="stat-icon">💰</div>
          </div>
        </div>
      )}

      {currentTab === "users" && <UserManagement API_URL={API_URL} />}
      {currentTab === "restaurants" && <RestaurantManagement API_URL={API_URL} />}
    </div>
  )
}

function UserManagement({ API_URL }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  })

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/admin/users?page=${page}&limit=${pagination.limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (response.data && response.data.data) {
        setUsers(response.data.data)
        setPagination(response.data.pagination || pagination)
      } else {
        setUsers(response.data || [])
      }
    } catch (error) {
      console.error("Tải người dùng thất bại", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      alert("Đã xóa người dùng thành công")
      fetchUsers(pagination.page)
    } catch (error) {
      alert("Xóa người dùng thất bại")
    }
  }

  if (loading) return <p>Đang tải người dùng...</p>

  return (
    <div className="management-section">
      <h3>Quản lý người dùng</h3>
      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Loại</th>
              <th>Đã tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge">{user.userType}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteUser(user._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            fetchUsers(newPage)
          }}
        />
      )}
    </div>
  )
}

function RestaurantManagement({ API_URL }) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  })

  useEffect(() => {
    fetchRestaurants(1)
  }, [])

  const fetchRestaurants = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/admin/restaurants?page=${page}&limit=${pagination.limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      // ensure we always store an array to avoid render errors if API returns an object
      const data = response.data;
      if (data && data.data) {
        setRestaurants(data.data)
        setPagination(data.pagination || pagination)
      } else if (Array.isArray(data)) {
        setRestaurants(data)
      } else if (Array.isArray(data?.restaurants)) {
        setRestaurants(data.restaurants)
      } else {
        console.error('Unexpected restaurants payload:', data)
        setRestaurants([])
      }
    } catch (error) {
      console.error("Tải nhà hàng thất bại", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRestaurantStatus = async (restaurantId, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/admin/restaurants/${restaurantId}`,
        { active: !currentStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      fetchRestaurants(pagination.page)
    } catch (error) {
      alert("Cập nhật nhà hàng thất bại")
    }
  }

  if (loading) return <p>Đang tải nhà hàng...</p>

  return (
    <div className="management-section">
      <h3>Quản lý nhà hàng</h3>
      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Chủ sở hữu</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(restaurants) ? restaurants : []).map((rest) => (
              <tr key={rest._id}>
                <td>{rest.name}</td>
                <td>{rest.owner?.name}</td>
                <td>{rest.address}</td>
                <td>
                  <span className={`status-badge ${rest.active ? "active" : "inactive"}`}>
                    {rest.active ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td>
                  <button className="btn-toggle" onClick={() => toggleRestaurantStatus(rest._id, rest.active)}>
                    {rest.active ? "Vô hiệu hóa" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            fetchRestaurants(newPage)
          }}
        />
      )}
    </div>
  )
}
