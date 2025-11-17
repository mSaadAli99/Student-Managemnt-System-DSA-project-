#include "storage.hpp"
#include "lessons.hpp"
#include <iostream>
#include <algorithm>
#include <fstream>
#include <sstream>
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
    loadData();    // for users and classes
    loadLessons(); // for lessons

    int lessonID;
    string studentEmail;

    string lessonIDStr;
    getline(cin, lessonIDStr);
    lessonID = stoi(lessonIDStr);
    getline(cin, studentEmail);

    // Trim inputs
    studentEmail.erase(0, studentEmail.find_first_not_of(" \t\n\r\f\v"));
    studentEmail.erase(studentEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Debug output
    cerr << "Debug: Completing lesson " << lessonID << " for student " << studentEmail << endl;

    // Validate student exists
    if (users.find(studentEmail) == users.end())
    {
        cerr << "Debug: Student not found" << endl;
        return cout << "ERROR:STUDENT_NOT_FOUND", 0;
    }

    User &student = users[studentEmail];

    // Validate student role
    if (student.role != "STUDENT")
    {
        cerr << "Debug: User is not a student" << endl;
        return cout << "ERROR:ONLY_STUDENTS_CAN_COMPLETE_LESSONS", 0;
    }

    // Validate lesson exists
    if (lessons.find(lessonID) == lessons.end())
    {
        cerr << "Debug: Lesson not found" << endl;
        return cout << "ERROR:LESSON_NOT_FOUND", 0;
    }

    Lesson &lesson = lessons[lessonID];
    int classID = lesson.classID;

    // Validate class exists
    if (classes.find(classID) == classes.end())
    {
        cerr << "Debug: Class not found" << endl;
        return cout << "ERROR:CLASS_NOT_FOUND", 0;
    }

    Class &cls = classes[classID];

    // Check if student is enrolled in the class
    auto it = find(cls.studentIDs.begin(), cls.studentIDs.end(), student.id);
    if (it == cls.studentIDs.end())
    {
        cerr << "Debug: Student not enrolled in class" << endl;
        return cout << "ERROR:STUDENT_NOT_ENROLLED", 0;
    }

    // Debug: Check current progress
    cerr << "Debug: Before update - Progress for class " << classID << " exists: "
         << (student.progress.progress.find(classID) != student.progress.progress.end()) << endl;

    // Mark lesson as completed in student's progress
    // Initialize progress for this class if it doesn't exist
    if (student.progress.progress.find(classID) == student.progress.progress.end())
    {
        student.progress.progress[classID] = unordered_map<int, bool>();
        cerr << "Debug: Created progress map for class " << classID << endl;
    }

    // Mark the specific lesson as completed
    student.progress.progress[classID][lessonID] = true;

    // Debug: Verify the update
    cerr << "Debug: After update - Lesson " << lessonID << " completed: "
         << student.progress.progress[classID][lessonID] << endl;

    saveData(); // Save the updated progress

    cout << "SUCCESS:LESSON_COMPLETED";
    return 0;
}