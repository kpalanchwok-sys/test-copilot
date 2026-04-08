const users = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "test@test.com",
    password: "test123", // In a real app, this would be hashed
    membershipType: "premium",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    coverImage: "https://images.unsplash.com/photo-1543039717-80d0a29b6562",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password456",
    membershipType: "free",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    coverImage: "https://images.unsplash.com/photo-1465778893808-9b3d1b443be7",
    createdAt: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    password: "password789",
    membershipType: "premium",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    coverImage: "https://images.unsplash.com/photo-1520943219761-6ca840e2e585",
    createdAt: "2023-03-10T09:15:00Z",
  },
];

module.exports = users;
