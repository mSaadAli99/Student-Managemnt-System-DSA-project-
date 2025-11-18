#include "storage.hpp"
#include <iostream>
#include <sstream>
#include <vector>
#include <algorithm>
using namespace std;

int main()
{
    loadData();

    string studentEmail;
    getline(cin, studentEmail);

    // Trim whitespace
    studentEmail.erase(0, studentEmail.find_first_not_of(" \t\n\r\f\v"));
    studentEmail.erase(studentEmail.find_last_not_of(" \t\n\r\f\v") + 1);

    // Validate student exists
    if (users.find(studentEmail) == users.end())
        return cout << "ERROR:STUDENT_NOT_FOUND", 0;

    User &student = users[studentEmail];

    vector<string> invitations;

    // Find all classes where this student has pending invites
    for (auto &classPair : classes)
    {
        Class &cls = classPair.second;

        // Check if student has pending invite in this class
        if (find(cls.pendingInvites.begin(), cls.pendingInvites.end(), student.id) != cls.pendingInvites.end())
        {
            User &teacher = users[cls.teacherEmail];
            stringstream inviteInfo;
            inviteInfo << cls.id << ":" << cls.name << ":" << cls.description << ":" << cls.teacherEmail << ":" << teacher.name;
            invitations.push_back(inviteInfo.str());
        }
    }

    // Output format: CLASS_ID:CLASS_NAME:TEACHER_EMAIL
    for (size_t i = 0; i < invitations.size(); i++)
    {
        cout << invitations[i];
        if (i + 1 < invitations.size())
        {
            cout << ";";
        }
    }

    if (invitations.empty())
    {
        cout << "NO_INVITATIONS";
    }

    return 0;
}