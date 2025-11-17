#pragma once
#include <string>
#include <vector>
using namespace std;

struct Class {
    int id;
    string name;
    string description;
    int teacherID;
    string teacherEmail;
    vector<int> studentIDs;
    vector<int> pendingInvites;
};
