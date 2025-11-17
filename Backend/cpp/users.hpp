// users.hpp
#pragma once
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

struct Progress
{
    unordered_map<int, unordered_map<int, bool>> progress;
};

struct User
{
    int id;
    string name;
    string email;
    string passwordHash;
    string role;
    string identifier;
    vector<int> classIDs;
    Progress progress; // per-class progress tracker
};