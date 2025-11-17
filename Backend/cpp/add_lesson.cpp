#include "storage.hpp"
#include "lessons.hpp"
#include <fstream>
#include <sstream>
#include <algorithm>
#include <iostream>

using namespace std;

// Initialize globals
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

void saveLessons()
{
    ofstream lessonFile("./db/lessons.db", ios::trunc);
    if (lessonFile.is_open())
    {
        for (auto &pair : lessons)
        {
            Lesson &l = pair.second;
            lessonFile << l.id << "," << l.title << "," << l.content << ","
                       << l.classID << "," << l.order << "\n";
        }
        lessonFile.close();
    }
}

int main()
{
    loadData();
    loadLessons();

    string teacherEmail;
    int classID;
    string lessonTitle;
    string lessonContent;

    getline(cin, teacherEmail);

    string classIDStr;
    getline(cin, classIDStr);
    classID = stoi(classIDStr);

    getline(cin, lessonTitle);
    getline(cin, lessonContent);

    // Trim inputs
    teacherEmail.erase(0, teacherEmail.find_first_not_of(" \t\n\r\f\v"));
    teacherEmail.erase(teacherEmail.find_last_not_of(" \t\n\r\f\v") + 1);
    lessonTitle.erase(0, lessonTitle.find_first_not_of(" \t\n\r\f\v"));
    lessonTitle.erase(lessonTitle.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate teacher exists and is a teacher
    if (users.find(teacherEmail) == users.end())
        return cout << "ERROR:TEACHER_NOT_FOUND", 0;

    if (users[teacherEmail].role != "TEACHER")
        return cout << "ERROR:NOT_A_TEACHER", 0;

    // Validate class exists and teacher owns it
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    Class &cls = classes[classID];
    if (cls.teacherEmail != teacherEmail)
        return cout << "ERROR:NOT_CLASS_OWNER", 0;

    // Create new lesson
    Lesson newLesson;
    newLesson.id = nextLessonID++;
    newLesson.title = lessonTitle;
    newLesson.content = lessonContent;
    newLesson.classID = classID;

    // Calculate order (count existing lessons for this class)
    newLesson.order = 0;
    for (auto &pair : lessons)
    {
        if (pair.second.classID == classID)
        {
            newLesson.order++;
        }
    }

    // Save lesson
    lessons[newLesson.id] = newLesson;
    saveLessons();

    cout << "SUCCESS:" << newLesson.id;
    return 0;
}