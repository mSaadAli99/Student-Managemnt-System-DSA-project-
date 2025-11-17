#pragma once
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

struct Lesson {
    int id;
    string title;
    string content;
    int classID;
    int order;
};

// Global lessons storage
extern std::unordered_map<int, Lesson> lessons;
extern int nextLessonID;