#include "storage.hpp"
#include "lessons.hpp"
#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <queue>
#include <vector>
using namespace std;

std::unordered_map<int, Lesson> lessons;
int nextLessonID = 1;

void loadLessons()
{
    ifstream lessonFile("./db/lessons.db");
    string line;

    if (lessonFile.is_open())
    {
        while (getline(lessonFile, line))
        {
            if (line.empty())
                continue;

            stringstream ss(line);
            Lesson l;

            try
            {
                getline(ss, line, ',');
                l.id = stoi(line);
                getline(ss, l.title, ',');
                getline(ss, l.content, ',');
                getline(ss, line, ',');
                l.classID = stoi(line);
                getline(ss, line);
                l.order = stoi(line);

                lessons[l.id] = l;
                nextLessonID = max(nextLessonID, l.id + 1);
            }
            catch (const exception &e)
            {
                cerr << "Error loading lesson: " << e.what() << endl;
            }
        }
        lessonFile.close();
    }
}

// Custom comparator for max-heap based on completion rate
struct StudentComparator
{
    bool operator()(const pair<double, string> &a, const pair<double, string> &b)
    {
        return a.first < b.first; // Max-heap: larger completion rate has higher priority
    }
};

int main()
{
    loadData();
    loadLessons();

    int classID;
    string userEmail;

    string classIDStr;
    getline(cin, classIDStr);
    classID = stoi(classIDStr);
    getline(cin, userEmail);

    // Trim
    userEmail.erase(0, userEmail.find_first_not_of(" \t\n\r\f\v"));
    userEmail.erase(userEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate user exists
    if (users.find(userEmail) == users.end())
        return cout << "ERROR:USER_NOT_FOUND", 0;

    // Validate class exists
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    Class &cls = classes[classID];
    User &user = users[userEmail];

    // Check access
    bool hasAccess = false;
    if (user.role == "TEACHER" && cls.teacherEmail == userEmail)
    {
        hasAccess = true;
    }
    else if (user.role == "STUDENT")
    {
        auto it = find(cls.studentIDs.begin(), cls.studentIDs.end(), user.id);
        if (it != cls.studentIDs.end())
        {
            hasAccess = true;
        }
    }

    if (!hasAccess)
        return cout << "ERROR:NO_ACCESS", 0;

    // Count total lessons in class using iterative counting
    int totalLessonsInClass = 0;
    for (auto &lessonPair : lessons)
    {
        if (lessonPair.second.classID == classID)
        {
            totalLessonsInClass++;
        }
    }

    // Use Max-Heap (Priority Queue) to get top 3
    priority_queue<pair<double, string>, vector<pair<double, string>>, StudentComparator> maxHeap;

    // Student info storage using array-like indexing concept
    vector<tuple<string, int, int>> studentInfo; // name, completed, total

    for (int studentID : cls.studentIDs)
    {
        // Find student by ID using linear search (but we're using heap for ranking)
        for (auto &userPair : users)
        {
            User &student = userPair.second;
            if (student.id == studentID && student.role == "STUDENT")
            {

                // Count completed lessons using iterative approach
                int completedLessons = 0;
                if (student.progress.progress.find(classID) != student.progress.progress.end())
                {
                    auto &classProgress = student.progress.progress[classID];
                    for (auto &lessonPair : lessons)
                    {
                        if (lessonPair.second.classID == classID)
                        {
                            if (classProgress.find(lessonPair.first) != classProgress.end() &&
                                classProgress[lessonPair.first])
                            {
                                completedLessons++;
                            }
                        }
                    }
                }

                double completionRate = totalLessonsInClass > 0 ? (double)completedLessons / totalLessonsInClass * 100 : 0;

                // Push to max-heap with completion rate as priority
                string studentKey = to_string(studentID) + "|" + student.name + "|" +
                                    to_string(completedLessons) + "|" + to_string(totalLessonsInClass);
                maxHeap.push({completionRate, studentKey});
                break;
            }
        }
    }

    // Extract top 3 from max-heap
    vector<string> topStudents;
    for (int i = 0; i < 3 && !maxHeap.empty(); i++)
    {
        auto top = maxHeap.top();
        topStudents.push_back(to_string(i + 1) + ":" + top.second + ":" + to_string((int)top.first));
        maxHeap.pop();
    }

    // Output top 3
    if (topStudents.empty())
    {
        cout << "NO_STUDENTS";
        return 0;
    }

    for (size_t i = 0; i < topStudents.size(); i++)
    {
        cout << topStudents[i];
        if (i + 1 < topStudents.size())
        {
            cout << ";";
        }
    }

    return 0;
}