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

    string studentEmail;
    getline(cin, studentEmail);

    // Trim
    studentEmail.erase(0, studentEmail.find_first_not_of(" \t\n\r\f\v"));
    studentEmail.erase(studentEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate student exists
    if (users.find(studentEmail) == users.end())
        return cout << "ERROR:STUDENT_NOT_FOUND", 0;

    User &student = users[studentEmail];

    // Validate user is a student
    if (student.role != "STUDENT")
        return cout << "ERROR:NOT_A_STUDENT", 0;

    // Get all classes the student is enrolled in
    vector<string> studentClasses;

    for (int classID : student.classIDs)
    {
        if (classes.find(classID) != classes.end())
        {
            Class &cls = classes[classID];

            // Calculate progress for this class
            int totalLessons = 0;
            int completedLessons = 0;

            for (auto &lessonPair : lessons)
            {
                if (lessonPair.second.classID == classID)
                {
                    totalLessons++;

                    // Check if student completed this lesson
                    if (student.progress.progress.find(classID) != student.progress.progress.end())
                    {
                        auto &classProgress = student.progress.progress[classID];
                        if (classProgress.find(lessonPair.first) != classProgress.end() &&
                            classProgress[lessonPair.first])
                        {
                            completedLessons++;
                        }
                    }
                }
            }

            stringstream classInfo;
            classInfo << cls.id << ":" << cls.name << ":" << cls.description << ":" << cls.teacherEmail << ":"
                      << completedLessons << ":" << totalLessons;
            studentClasses.push_back(classInfo.str());
        }
    }

    // Output classes
    if (studentClasses.empty())
    {
        cout << "NO_CLASSES";
        return 0;
    }

    for (size_t i = 0; i < studentClasses.size(); i++)
    {
        cout << studentClasses[i];
        if (i + 1 < studentClasses.size())
        {
            cout << ";";
        }
    }

    return 0;
}