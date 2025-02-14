export const mockUsers = [
    {
        id: 1,
        name: "John Smith",
        role: "Software Engineer",
        avatar: "https://ui-avatars.com/api/?name=John+Smith"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Product Manager",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson"
    },
    {
        id: 3,
        name: "Mike Chen",
        role: "UX Designer",
        avatar: "https://ui-avatars.com/api/?name=Mike+Chen"
    },
    {
        id: 4,
        name: "Emma Davis",
        role: "Frontend Developer",
        avatar: "https://ui-avatars.com/api/?name=Emma+Davis"
    },
    {
        id: 5,
        name: "Alex Kumar",
        role: "Backend Developer",
        avatar: "https://ui-avatars.com/api/?name=Alex+Kumar"
    },
    {
        id: 6,
        name: "Lisa Wang",
        role: "Project Manager",
        avatar: "https://ui-avatars.com/api/?name=Lisa+Wang"
    }
];

export const mockAttendance = [
    // Week 1
    { id: 1, userId: 1, date: "2025-02-03" },
    { id: 2, userId: 2, date: "2025-02-03" },
    { id: 3, userId: 3, date: "2025-02-03" },
    { id: 4, userId: 4, date: "2025-02-04" },
    { id: 5, userId: 5, date: "2025-02-04" },
    { id: 6, userId: 1, date: "2025-02-05" },
    { id: 7, userId: 2, date: "2025-02-05" },
    { id: 8, userId: 6, date: "2025-02-06" },
    { id: 9, userId: 3, date: "2025-02-07" },
    { id: 10, userId: 4, date: "2025-02-07" },

    // Week 2
    { id: 11, userId: 1, date: "2025-02-10" },
    { id: 12, userId: 2, date: "2025-02-10" },
    { id: 13, userId: 3, date: "2025-02-10" },
    { id: 14, userId: 4, date: "2025-02-10" },
    { id: 15, userId: 5, date: "2025-02-10" }, // 5 people
    { id: 16, userId: 1, date: "2025-02-12" },
    { id: 17, userId: 3, date: "2025-02-12" },
    { id: 18, userId: 5, date: "2025-02-12" },
    { id: 19, userId: 6, date: "2025-02-14" }, // Valentine's day
    { id: 20, userId: 2, date: "2025-02-14" },

    // Week 3
    { id: 21, userId: 4, date: "2025-02-17" },
    { id: 22, userId: 5, date: "2025-02-17" },
    { id: 23, userId: 6, date: "2025-02-17" },
    { id: 24, userId: 1, date: "2025-02-19" },
    { id: 25, userId: 2, date: "2025-02-19" },
    { id: 26, userId: 3, date: "2025-02-19" },
    { id: 27, userId: 4, date: "2025-02-19" },
    { id: 28, userId: 1, date: "2025-02-21" },
    { id: 29, userId: 5, date: "2025-02-21" },
    
   // Additional attendance records
   // User ID: 1
   { id: 40, userId: 1, date: "2025-02-01" },
   { id: 41, userId: 1, date: "2025-02-08" },
   { id: 42, userId: 1, date: "2025-02-15" },
   { id: 43, userId: 1, date: "2025-02-22" },
   { id: 44, userId: 1, date: "2025-02-26" },
   
   // User ID: 2
   { id: 45, userId: 2, date: "2025-02-01" },
   { id: 46, userId: 2, date: "2025-02-08" },
   { id: 47, userId: 2, date: "2025-02-15" },
   { id: 48, userId: 2, date: "2025-02-22" },
   { id: 49, userId: 2, date: "2025-02-26" },
   
   // User ID: 3
   { id: 50, userId: 3, date: "2025-02-01" },
   { id: 51, userId: 3, date: "2025-02-08" },
   { id: 52, userId: 3, date: "2025-02-15" },
   { id: 53, userId: 3, date: "2025-02-22" },
   { id: 54, userId: 3, date: "2025-02-26" },
   
   // User ID: 4
   { id: 55, userId: 4, date: "2025-02-01" },
   { id: 56, userId: 4, date: "2025-02-08" },
   { id: 57, userId: 4, date: "2025-02-15" },
   { id: 58, userId: 4, date: "2025-02-22" },
   { id: 59, userId: 4, date: "2025-02-26" },
   
   // User ID: 5
   { id: 60, userId: 5, date: "2017-01-01" }
];



export const getCurrentUserAttendance = (userId = 1) => {
    return mockAttendance.filter(a => a.userId === userId);
};

export const getCurrentUser = () => mockUsers.find(u => u.id === 1);