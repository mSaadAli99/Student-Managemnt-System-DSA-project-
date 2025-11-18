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

    int classID;
    string teacherEmail;

    string classIDStr;
    getline(cin, classIDStr);
    classID = stoi(classIDStr);
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

    // Validate class exists
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    Class &cls = classes[classID];

    // Validate teacher owns this class
    if (cls.teacherEmail != teacherEmail)
        return cout << "ERROR:NOT_CLASS_OWNER", 0;

    // Get all students enrolled in this class
    vector<string> studentList;

    for (int studentID : cls.studentIDs)
    {
        // Find student by ID
        for (auto &userPair : users)
        {
            User &user = userPair.second;
            if (user.id == studentID && user.role == "STUDENT")
            {

                // Calculate student progress in this class
                int totalLessons = 0;
                int completedLessons = 0;

                for (auto &lessonPair : lessons)
                {
                    if (lessonPair.second.classID == classID)
                    {
                        totalLessons++;

                        // Check if student completed this lesson
                        if (user.progress.progress.find(classID) != user.progress.progress.end())
                        {
                            auto &classProgress = user.progress.progress[classID];
                            if (classProgress.find(lessonPair.first) != classProgress.end() &&
                                classProgress[lessonPair.first])
                            {
                                completedLessons++;
                            }
                        }
                    }
                }

                int progressPercentage = totalLessons > 0 ? (completedLessons * 100) / totalLessons : 0;

                stringstream studentInfo;
                studentInfo << user.id << ":" << user.name << ":" << user.email << ":"
                            << completedLessons << ":" << totalLessons << ":" << progressPercentage;
                studentList.push_back(studentInfo.str());
                break;
            }
        }
    }

    // Output students
    if (studentList.empty())
    {
        cout << "NO_STUDENTS";
        return 0;
    }

    for (size_t i = 0; i < studentList.size(); i++)
    {
        cout << studentList[i];
        if (i + 1 < studentList.size())
        {
            cout << ";";
        }
    }

    return 0;
}