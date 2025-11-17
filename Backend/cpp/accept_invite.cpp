#include "storage.hpp"
#include <iostream>
#include <algorithm>
using namespace std;

int main()
{
    loadData();

    int classID;
    string studentEmail;
    string action; // "accept" or "reject"

    cin >> classID;
    cin.ignore(); // Clear newline

    getline(cin, studentEmail);
    getline(cin, action);

    // Trim whitespace
    studentEmail.erase(0, studentEmail.find_first_not_of(" \t\n\r\f\v"));
    studentEmail.erase(studentEmail.find_last_not_of(" \t\n\r\f\v") + 1);
    action.erase(0, action.find_first_not_of(" \t\n\r\f\v"));
    action.erase(action.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate student exists
    if (users.find(studentEmail) == users.end())
        return cout << "ERROR:STUDENT_NOT_FOUND", 0;

    User &student = users[studentEmail];

    // Validate class exists
    if (classes.find(classID) == classes.end())
        return cout << "ERROR:CLASS_NOT_FOUND", 0;

    Class &cls = classes[classID];

    // Check if student has pending invite
    auto inviteIt = find(cls.pendingInvites.begin(), cls.pendingInvites.end(), student.id);
    if (inviteIt == cls.pendingInvites.end())
        return cout << "ERROR:NO_PENDING_INVITE", 0;

    if (action == "accept")
    {
        // Remove from pending invites
        cls.pendingInvites.erase(inviteIt);

        // Add to class students
        cls.studentIDs.push_back(student.id);

        // Add class to student's class list
        student.classIDs.push_back(classID);

        // Initialize progress tracking for this class
        student.progress.progress[classID] = unordered_map<int, bool>();

        saveData();
        cout << "SUCCESS:INVITE_ACCEPTED";
    }
    else if (action == "reject")
    {
        // Simply remove from pending invites
        cls.pendingInvites.erase(inviteIt);
        saveData();
        cout << "SUCCESS:INVITE_REJECTED";
    }
    else
    {
        cout << "ERROR:INVALID_ACTION";
    }

    return 0;
}