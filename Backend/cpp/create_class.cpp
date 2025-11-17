#include "storage.hpp"
#include <iostream>
using namespace std;

int main()
{
    loadData();

    string teacherEmail;
    string className;
    string classDescription;

    getline(cin, teacherEmail);
    if (teacherEmail.size() && teacherEmail[0] == ' ')
        teacherEmail = teacherEmail.substr(1);
    getline(cin, className);
    if (className.size() && className[0] == ' ')
        className = className.substr(1);
    getline(cin, classDescription);
    if (classDescription.size() && classDescription[0] == ' ')
        classDescription = classDescription.substr(1);

    // Validate teacher
    if (users.find(teacherEmail) == users.end())
    {
        cout << "ERROR:TEACHER_NOT_FOUND";
        return 0;
    }

    if (users[teacherEmail].role != "TEACHER")
    {
        cout << "ERROR:NOT_A_TEACHER";
        return 0;
    }

    // Create class
    Class c;
    c.id = nextClassID++;
    c.name = className;
    c.description = classDescription;
    c.teacherID = users[teacherEmail].id;
    c.teacherEmail = teacherEmail;

    classes[c.id] = c;

    // Add class ID to teacher's profile
    users[teacherEmail].classIDs.push_back(c.id);

    saveData();

    cout << "SUCCESS:" << c.id;
    return 0;
}
