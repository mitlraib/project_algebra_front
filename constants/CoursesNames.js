export const courses = [
    {
        id: 1,
        title: "פעולות בסיסיות:",
        topics: [
            { id: 1, name: 'חיבור' },
            { id: 2, name: 'חיסור' },
            { id: 3, name: 'כפל' },
            { id: 4, name: 'חילוק' }
        ]
    },
    {
        id: 2,
        title: "שברים:",
        topics: [
            { id: 5, name: 'חיבור שברים' },
            { id: 6, name: 'חיסור שברים' },
            { id: 7, name: 'כפל שברים' },
            { id: 8, name: 'חילוק שברים' }
        ]
    }
];

// נבנה גם מפת topicId -> name כדי להשתמש בקלות
export const topicNames = Object.fromEntries(
    courses.flatMap(course => course.topics.map(topic => [topic.id, topic.name]))
);
