#include "storage.hpp"
// #include "lessons.hpp"
#include <fstream>
#include <sstream>
#include <algorithm>
#include <iostream>

std::unordered_map<std::string, User> users;
std::unordered_map<int, Class> classes;
// std::unordered_map<int, Lesson> lessons;

int nextUserID = 1;
int nextClassID = 1;
// int nextLessonID = 1;

// void loadLessons()
// {
//     ifstream lessonFile("./db/lessons.db");
//     string line;

//     if (lessonFile.is_open())
//     {
//         while (getline(lessonFile, line))
//         {
//             if (line.empty())
//                 continue;

//             stringstream ss(line);
//             Lesson l;

//             try
//             {
//                 getline(ss, line, ',');
//                 l.id = stoi(line);
//                 getline(ss, l.title, ',');
//                 getline(ss, l.content, ',');
//                 getline(ss, line, ',');
//                 l.classID = stoi(line);
//                 getline(ss, line);
//                 l.order = stoi(line);

//                 lessons[l.id] = l;
//                 nextLessonID = max(nextLessonID, l.id + 1);
//             }
//             catch (const exception &e)
//             {
//                 cerr << "Error loading lesson: " << e.what() << endl;
//             }
//         }
//         lessonFile.close();
//     }
// }

void loadData()
{
    // Load Users (UPDATED to handle progress)
    ifstream userFile("./db/users.db");
    string line;
    if (userFile.is_open())
    {
        while (getline(userFile, line))
        {
            if (line.empty())
                continue;

            stringstream ss(line);
            User u;
            string classList;
            string progressData; // ADDED

            try
            {
                getline(ss, line, ',');
                if (line.empty())
                    continue;
                u.id = stoi(line);

                getline(ss, u.name, ',');
                getline(ss, u.email, ',');
                getline(ss, u.passwordHash, ',');
                getline(ss, u.role, ',');
                getline(ss, u.identifier, ',');
                getline(ss, classList, ',');
                getline(ss, progressData); // ADDED - read progress data

                // Parse class IDs
                stringstream cl(classList);
                string cid;
                while (getline(cl, cid, ';'))
                    if (!cid.empty())
                        u.classIDs.push_back(stoi(cid));

                // PARSE PROGRESS DATA - format: classID:lessonID:status;classID:lessonID:status
                if (!progressData.empty())
                {
                    stringstream progressStream(progressData);
                    string progressEntry;
                    while (getline(progressStream, progressEntry, ';'))
                    {
                        if (!progressEntry.empty())
                        {
                            stringstream entryStream(progressEntry);
                            string classIDStr, lessonIDStr, statusStr;

                            getline(entryStream, classIDStr, ':');
                            getline(entryStream, lessonIDStr, ':');
                            getline(entryStream, statusStr, ':');

                            int classID = stoi(classIDStr);
                            int lessonID = stoi(lessonIDStr);
                            bool completed = (statusStr == "1");

                            u.progress.progress[classID][lessonID] = completed;
                        }
                    }
                }

                users[u.email] = u;
                nextUserID = max(nextUserID, u.id + 1);
            }
            catch (const std::exception &e)
            {
                cerr << "Error loading user: " << e.what() << endl;
                continue;
            }
        }
        userFile.close();
    }

    // Load Classes (unchanged)
    ifstream classFile("./db/classes.db");
    if (classFile.is_open())
    {
        while (getline(classFile, line))
        {
            if (line.empty())
                continue;

            stringstream ss(line);
            Class c;
            string studentList, inviteList;

            try
            {
                getline(ss, line, ',');
                if (line.empty())
                    continue;
                c.id = stoi(line);

                getline(ss, c.name, ',');
                getline(ss, c.description, ',');

                string teacherIDStr;
                getline(ss, teacherIDStr, ',');
                if (!teacherIDStr.empty())
                    c.teacherID = stoi(teacherIDStr);
                else
                    c.teacherID = -1;

                getline(ss, c.teacherEmail, ',');
                getline(ss, studentList, ',');
                getline(ss, inviteList);

                // parse student IDs
                stringstream s1(studentList);
                while (getline(s1, line, ';'))
                    if (!line.empty())
                        c.studentIDs.push_back(stoi(line));

                // parse pending invites
                stringstream s2(inviteList);
                while (getline(s2, line, ';'))
                    if (!line.empty())
                        c.pendingInvites.push_back(stoi(line));

                classes[c.id] = c;
                nextClassID = max(nextClassID, c.id + 1);
            }
            catch (const std::exception &e)
            {
                cerr << "Error loading class: " << e.what() << endl;
                continue;
            }
        }
        classFile.close();
    }
}

void saveData()
{
    // Save Users (UPDATED to save progress)
    ofstream userFile("./db/users.db", ios::trunc);
    if (userFile.is_open())
    {
        for (auto &p : users)
        {
            User &u = p.second;
            userFile << u.id << "," << u.name << "," << u.email << "," << u.passwordHash << "," << u.role << "," << u.identifier << ",";

            // Save class IDs
            for (size_t i = 0; i < u.classIDs.size(); i++)
                userFile << u.classIDs[i] << (i + 1 < u.classIDs.size() ? ";" : "");
            userFile << ",";

            // SAVE PROGRESS DATA - format: classID:lessonID:status;classID:lessonID:status
            bool firstProgress = true;
            for (auto &classProgress : u.progress.progress)
            {
                int classID = classProgress.first;
                for (auto &lessonProgress : classProgress.second)
                {
                    int lessonID = lessonProgress.first;
                    bool completed = lessonProgress.second;

                    if (!firstProgress)
                        userFile << ";";
                    userFile << classID << ":" << lessonID << ":" << (completed ? "1" : "0");
                    firstProgress = false;
                }
            }

            userFile << "\n";
        }
        userFile.close();
    }

    // Save Classes (unchanged)
    ofstream classFile("./db/classes.db", ios::trunc);
    if (classFile.is_open())
    {
        for (auto &p : classes)
        {
            Class &c = p.second;
            classFile << c.id << "," << c.name << "," << c.description << ",";
            classFile << c.teacherID << "," << c.teacherEmail << ",";

            // students
            for (size_t i = 0; i < c.studentIDs.size(); i++)
                classFile << c.studentIDs[i] << (i + 1 < c.studentIDs.size() ? ";" : "");
            classFile << ",";

            // pending invites
            for (size_t i = 0; i < c.pendingInvites.size(); i++)
                classFile << c.pendingInvites[i] << (i + 1 < c.pendingInvites.size() ? ";" : "");

            classFile << "\n";
        }
        classFile.close();
    }

}