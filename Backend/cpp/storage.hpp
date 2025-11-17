#pragma once
#include <unordered_map>
#include "users.hpp"
#include "class.hpp"

extern std::unordered_map<std::string, User> users;
extern std::unordered_map<int, Class> classes;

extern int nextUserID;
extern int nextClassID;

void loadData();
void saveData();

