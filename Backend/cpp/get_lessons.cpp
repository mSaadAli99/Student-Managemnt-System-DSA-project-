#include "storage.hpp"
#include "lessons.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
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

    User &user = users[userEmail];

    // Validate class exists
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    Class &cls = classes[classID];

    // Check if user has access to this class
    bool hasAccess = false;
    if (user.role == "TEACHER" && cls.teacherEmail == userEmail)
    {
        hasAccess = true;
    }
    else if (user.role == "STUDENT")
    {
        // Check if student is enrolled
        auto it = find(cls.studentIDs.begin(), cls.studentIDs.end(), user.id);
        if (it != cls.studentIDs.end())
        {
            hasAccess = true;
        }
    }

    if (!hasAccess)
        return cout << "ERROR:NO_ACCESS", 0;

    // Collect lessons for this class
    vector<Lesson> classLessons;
    for (auto &pair : lessons)
    {
        if (pair.second.classID == classID)
        {
            classLessons.push_back(pair.second);
        }
    }

    // Sort by order
    sort(classLessons.begin(), classLessons.end(),
         [](const Lesson &a, const Lesson &b)
         { return a.order < b.order; });

    // Output lessons with full content
    if (classLessons.empty())
    {
        cout << "NO_LESSONS";
        return 0;
    }

    for (size_t i = 0; i < classLessons.size(); i++)
    {
        Lesson &l = classLessons[i];

        // Format: ID:TITLE:ORDER:CONTENT:COMPLETED_STATUS
        cout << l.id << ":" << l.title << ":" << l.order << ":" << l.content;

        // Add completion status for students
        if (user.role == "STUDENT")
        {
            bool completed = false;
            // Check if progress tracking exists for this class and lesson
            if (user.progress.progress.find(classID) != user.progress.progress.end())
            {
                auto &classProgress = user.progress.progress[classID];
                if (classProgress.find(l.id) != classProgress.end())
                {
                    completed = classProgress[l.id];
                }
            }
            cout << ":" << (completed ? "completed" : "pending");
        }

        if (i + 1 < classLessons.size())
        {
            cout << ";";
        }
    }

    return 0;
}