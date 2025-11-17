#include "storage.hpp"
#include <iostream>
#include <algorithm>
using namespace std;

int main()
{
    loadData();

    int classID;
    string studentEmail, teacherEmail;

    cin >> classID;

    // Clear the newline left by cin >>
    cin.ignore();

    getline(cin, teacherEmail);
    getline(cin, studentEmail);

    // Trim whitespace
    teacherEmail.erase(0, teacherEmail.find_first_not_of(" \t\n\r\f\v"));
    teacherEmail.erase(teacherEmail.find_last_not_of(" \t\n\r\f\v") + 1);
    studentEmail.erase(0, studentEmail.find_first_not_of(" \t\n\r\f\v"));
    studentEmail.erase(studentEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Debug output to see what was read
    cerr << "Debug - classID: " << classID << endl;
    cerr << "Debug - teacherEmail: '" << teacherEmail << "'" << endl;
    cerr << "Debug - studentEmail: '" << studentEmail << "'" << endl;

    // Validate teacher
    if (users.find(teacherEmail) == users.end())
    {
        cerr << "Teacher not found: " << teacherEmail << endl;
        return cout << "ERROR:TEACHER_NOT_FOUND", 0;
    }

    if (users[teacherEmail].role != "TEACHER")
        return cout << "ERROR:ONLY_TEACHER_ALLOWED", 0;

    // Validate class
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    // Student exists? (search by email)
    int studentID = -1;
    if (users.find(studentEmail) != users.end())
    {
        studentID = users[studentEmail].id;
    }

    if (studentID == -1)
        return cout << "ERROR:STUDENT_NOT_FOUND", 0;

    // Already in class?
    auto &cls = classes[classID];

    if (find(cls.studentIDs.begin(), cls.studentIDs.end(), studentID) != cls.studentIDs.end())
        return cout << "ERROR:ALREADY_JOINED", 0;

    // Already invited?
    if (find(cls.pendingInvites.begin(), cls.pendingInvites.end(), studentID) != cls.pendingInvites.end())
        return cout << "ERROR:ALREADY_INVITED", 0;

    // Add invite
    cls.pendingInvites.push_back(studentID);

    saveData();

    cout << "SUCCESS:INVITE_SENT";
    return 0;
}