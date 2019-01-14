#!/usr/bin/env python
# Requires Python 3.0 or greater

# Test suite. Assumes subfolder 'test' of current path contains test files.
# python regEx.py "([a-z]*)_([a-z]*)_([a-z]*)" "\2_\3_\1" test\*.txt
# python regEx.py "([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)" "\5_\7_\2_\6_\3_\4_\1" test\*
# python regEx.py foo bar test\foo1 test\foo2
# python regEx.py foo bar test\*
# python regEx.py "---*" "-" test\*-*

# python refactor.py "actorLst \= new std\:\:vector\< WO\* \>\;" "this->actorLst = new WorldList();"
# REPLACES "actorLst = new std::vector< WO* >;" with
#         "this->actorLst = new WorldList();"

import sys
import os
import os.path
import glob
import re
import string

global globalViewMode
globalMatchedFilesCount = 0
globalViewMode = 1  # 1 means only view what would be modifed, 0 means perform the regex modification


def refactorTextWithinFile(oldFileName, regExp, re2):
    file = open(oldFileName, 'r')  # Open file for reading
    strText = file.read()
    strOut = regExp.sub(re2, strText)
    file.close()

    if (strText != strOut):
        if (globalViewMode == 0):
            file = open(oldFileName, 'w')  # Clears file to empty
            file.write(strOut)
            file.close()
            print("Refactored Code In:", oldFileName)
        else:
            print("Would refactor Code In:", oldFileName)
        global globalMatchedFilesCount
        globalMatchedFilesCount = globalMatchedFilesCount + 1


if (len(sys.argv) != 4):
    print("")
    print("Usage (from usr/modules/): refactor (v|r) RegExToFind RegExToReplace")
    print("   v: means view-only - no files will be modified. Only those")
    print("      files that would be modified are listed.")
    print("   r: replace - executes the regex on all matched files.")
    print("")
    print("Examples:")
    print("python refactor.py \"([a-z]*)_([a-z]*)_([a-z]*)\" \"\\2_\\3_\\1\"")
    print(
        "python refactor.py \"([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)_([a-z]*)\" \"\\5_\\7_\\2_\\6_\\3_\\4_\\1\"")
    print("python refactor.py foo bar")
    print("python refactor.py foo bar")
    print("python refactor.py \"---*\" \"-\"")
    #       python renameFiles.py v "GLViewNyklDTED\.cpp" "FunDTED.cpp" (No need to escape quotes in doc)
    print("python renameFiles.py v \"GLViewNyklDTED\.cpp\" \"FunDTED.cpp\"")
    # Replace SteaMiE* with Aftr*
    # python refactor.py v "(?i)steamie([A-Za-z0-9]*)" "Aftr\1"
    quit()

# fileExt = sys.argv[1]
if (sys.argv[1] == 'r' or sys.argv[1] == 'R'):
    globalViewMode = 0
else:
    globalViewMode = 1
re1 = sys.argv[2]
re2 = sys.argv[3]
# print( "file ext is '",fileExt,"'" )
print("Finding all occurances of '", re1, "'", sep='')
if (globalViewMode == 1):
    print("Viewing which files contain a match. Not replacing with '", re2, "'", sep='')
else:
    print("Replacing with '", re2, "'", sep='')

regExp = re.compile(re1)

listOfNewFiles = list()
matchingFiles = list()

##for i in range( 3, len(sys.argv) ):
##non-sensitive module files
matchingFiles.append((glob.glob('./test/*.txt')))


files = list()
for j in matchingFiles:
    for k in j:
        files.append(k)

print("Searching across ", len(files), " files.", sep='')
for j in files:
    # print( j )
    refactorTextWithinFile(j, regExp, re2)

if (globalViewMode == 1):
    print("No changes applied. Matches found in ", globalMatchedFilesCount, " files...", sep='')
else:
    print("Modified ", globalMatchedFilesCount, " files...", sep='')
print("Refactoring Complete...")
