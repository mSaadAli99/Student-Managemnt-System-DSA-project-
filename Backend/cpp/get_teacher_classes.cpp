#include "storage.hpp"
#include "lessons.hpp"
#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
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

    string teacherEmail;
    getline(cin, teacherEmail);

    // Trim
    teacherEmail.erase(0, teacherEmail.find_first_not_of(" \t\n\r\f\v"));
    teacherEmail.erase(teacherEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate teacher exists
    if (users.find(teacherEmail) == users.end())
        return cout << "ERROR:TEACHER_NOT_FOUND", 0;

    User &teacher = users[teacherEmail];

    // Validate user is a teacher
    if (teacher.role != "TEACHER")
        return cout << "ERROR:NOT_A_TEACHER", 0;

    // Get all classes taught by this teacher
    vector<string> teacherClasses;

    for (auto &classPair : classes)
    {
        Class &cls = classPair.second;

        if (cls.teacherEmail == teacherEmail)
        {
            // Count lessons for this class
            int lessonCount = 0;
            for (auto &lessonPair : lessons)
            {
                if (lessonPair.second.classID == cls.id)
                {
                    lessonCount++;
                }
            }

            stringstream classInfo;
            classInfo << cls.id << ":" << cls.name << ":" << cls.description << ":"
                      << cls.studentIDs.size() << ":" << lessonCount;
            teacherClasses.push_back(classInfo.str());
        }
    }

    // Output classes
    if (teacherClasses.empty())
    {
        cout << "NO_CLASSES";
        return 0;
    }

    for (size_t i = 0; i < teacherClasses.size(); i++)
    {
        cout << teacherClasses[i];
        if (i + 1 < teacherClasses.size())
        {
            cout << ";";
        }
    }

    return 0;
}