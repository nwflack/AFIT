#include <stdio.h>
#include <dirent.h>
#include <string.h>

int main()
{
    int function;
    function = 1;   // this int controls the type (sync or deduplicate)
    // for the program (1 = sync; 2=deduplicate)
    
    // initialize test folders
    system("mkdir dir1");
    system("echo \" this is file2 \" >dir1/file1");
    system("echo \" this is test1 \" >dir1/test1");
    //system("echo \" this is test1 \" >dir1/test1");
    //system("echo \" this is test1 \" >dir1/test1");
    
    system("mkdir dir2");
    system("echo \"this is file2\" >dir2/file2");
    system("echo \"this is test2\" >dir2/test2");
    system("echo \"this is test2\" >dir2/test1");
    
    system("mkdir dir3");
    system("echo \"this is test1\" >dir3/test1");
    system("echo \"this is test2\" >dir3/test2");
    system("echo \"this is test3\" >dir3/test3");
    
    // Print current contects of directories (dir1 and dir2)
    struct dirent *de;          //pointer for directory entry
    DIR *dr = opendir(".");     //returns a pointer of DIR type
    
    if (dr == NULL)     //opendir returns NULL if counldn't open directory
    {
        printf( "Could not open current directory\n" );
        return -1;
    }
    printf("Current files in Home Folder: \n");
    
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de -> d_name);
    }
    closedir(dr);
    dr = NULL;
    dr = opendir("./dir1");
    
    if (dr == NULL) //opendir returns NULL if counldn't open directory
    {
        printf( "Could not open current directory\n" );
        return -1;
    }
    
    printf("Current files in dir1: \n" );
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de -> d_name);
    }
    closedir(dr);
    
    //show files in dir2
    dr = NULL;
    dr = opendir("./dir2");
    if (dr == NULL) //opendir returns NULL if counldn't open directory
    {
        printf( "Could not open current directory\n" );
        return -1;
    }
    printf("Current files in dir2: \n" );
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de -> d_name);
    }
    closedir(dr);
    
    //START OF PROGRAM
    
    // 1. Accept “mode” (sync or duplicate) as a parameter
    // 2. Accept folder names (note: only did filenames 1 deep);
    
    printf("Please enter the mode you would like to use as a single \n");
    printf("character ('s' or 'd') followed by the two folder names you wish to use.\n");
    printf("Each should be separated by one space.\n");
    printf("Enter 's' for Sync or 'd' for Deduplicate.\n");
    
    // Note: the max length of a folder name in windows is 256 characters.
    // Therefore the max string length for two folder names is 1 + 1 + 256 + 256
    // + 1, for a total of 515.
    
    char input[515];
    char mode = NULL;
    int tries = 5;
    int good = 0;
    
    while (tries != 0 || good != 1) {
        
        fgets(input, 515, stdin);
        input[515] = '\0';
        
        //the first character dictates the mode
        mode = input[0];
        
        if (mode == 's') {
            function = 1;
            // we want to sync the two folders provided by the user
            printf("Thank you. Program will execute in Sync mode.\n");
            good = 1;
            break;
        }
        else if ( mode == 'd') {
            function = 2;
            // we want to deduplcate the two input folders provided by the user
            printf("Thank you. Program will execute in Deduplicate mode.\n");
            good = 1;
            break;
        }
        else {
            //if the input is not a 'd' or a 's'
            printf ("Input invalid. Please enter 's' for Sync and");
            printf ("'d' for Deduplicate\n");
            tries--;
            
            if (tries==0) {  //check to see if they are trying several invalid
                //responses in a row
                printf ("I think something is wrong, ");
                printf ("please restart the program. Goodbye.");
                return -1;
            }
        }
    }
    
    //check input and create folder1
    int i=0;
    int j=0;
    char folder1[515];
    for ( i=2; i<=515; i++) {
        if ( (input[i] == '/') ||
            (input[i] == '<') ||
            (input[i] == '>') ||
            (input[i] == ':') ||
            (input[i] == '\'') ||
            (input[i] == '|') ||
            (input[i] == '?') ||
            (input[i] == '*') ||
            (input[i] == '.') ||
            (input[i] == ';') ||
            (input[i] == '=') ||
            (input[i] == ',') ||
            (input[i] == '[') ||
            (input[i] == ']') ) {
            
            //input character is invald. Replace with '_'
            input[i] = '-';
        }
        else if (input[i] == ' ' || input[i] == '\0' || input[i] == '\n') {
            folder1[j] = '\0';
            j = i;
            break;
        }
        else {
            folder1[j] = input[i];
            j++;
        }
    }
    folder1[515] = '\0';
    
    
    //check input and create folder2
    char folder2[515];
    int k=0;
    for (i=j+1; i<=515; i++) {
        if ( (input[i] == '/') ||
            (input[i] == '<') ||
            (input[i] == '>') ||
            (input[i] == ':') ||
            (input[i] == '\'') ||
            (input[i] == '|') ||
            (input[i] == '?') ||
            (input[i] == '*') ||
            (input[i] == '.') ||
            (input[i] == ';') ||
            (input[i] == '=') ||
            (input[i] == ',') ||
            (input[i] == '[') ||
            (input[i] == ']') ) {
            
            //input character is invald. Replace with '_'
            input[i] = '_';
        }
        else if (input[i] == ' ' || input[i] == '\0' || input[i] == '\n') {
            folder2[k] = '\0';
            break;
        }
        else {
            folder2[k] = input[i];
            k++;
        }
    }
    folder2[515] = '\0';
    
    if (folder1 == NULL && folder2 == NULL) {
        printf("Must provide two directories as input. Please try again");
        return -1;
    }
    
    if (folder1 == NULL || folder2 == NULL) {
        printf("Must provide two valid directories. Please try again");
        return -1;
    }
    
    if (strcmp(folder1, folder2) == 0)
    {
        printf("Directories must be different. Please try again");
        return -1;
    }
    
    // 3. Perform the mode on the folder paths
    // Sync – the end state is that the folders hold the same contents afterwards
    // Deduplicate – the end state is that the second folder does not contain any files in the first folder
    
    char path1[515];
    path1[0] = '.';
    path1[1] = '/';
    
    j=2;
    for (i=0; i<=515; i++) {
        
        if (folder1[i] == '\0' || folder1[i] ==' ') {
            path1[j] = '\0';
            break;
        }
        else {
            path1[j] = folder1[i];
            j++;
        }
    }
    path1[515] = '\0';
    
    
    char path2[515];
    path2[0] = '.';
    path2[1] = '/';
    
    j=2;
    for (i=0; i<=515; i++) {
        if (folder2[i] == '\0' || folder2[i] ==' ') {
            path2[j] = '\0';
            break;
        }
        else {
            path2[j] = folder2[i];
            j++;
        }
    }
    path2[515] = '\0';
    
    if (function == 1) {
        // Perform Sync:
        // This sync function takes the first folder given and copies its
        // contents into the second folder. After the operation, both folders
        // will have the same contents as the first folder listed.
        // This function will overwrite any files in the second folder provided
        // by the user
        
        struct dirent *de1;
        struct dirent *de2;
        DIR *dr1;
        DIR *dr2;
        char buf[515];
        char buf1[515];
        char buf2[515];
        FILE *fptr1, *fptr2;
        
        char command[521];
        strcpy(command, "mkdir ");
        strcat(command, path2);
        system(command);
        
        // open first folder
        dr1 = opendir(path1); //returns a pointer of DIR type
        
        if (dr1 == NULL) //opendir returns NULL if counldn't open directory
        {
            printf( "Could not open current directory\n" );
            return -1;
        }
        
        dr2 = opendir(path2);
        if (dr2 == NULL)
        {
            printf( "Could not open current directory\n" );
            return -1;
        }
        
        //need to delete files currently in folder2
        while (de2 = readdir(dr2)) {
            sprintf(buf, "%s/%s", path2, de2->d_name);
            remove(buf);
        }
        closedir(dr2);
        
        // copy files from folder 1 to folder 2
        dr2 = opendir(path2);
        while (de1 = readdir(dr1))
        {
            sprintf(buf1, "%s/%s", path1, de1->d_name);
            
            // Open one file for reading
            fptr1 = fopen(buf1, "r");
            
            if (fptr1 == NULL)
            {
                printf("Cannot open file %s \n", buf1);
                fclose(buf1);
                closedir(dr2);
                closedir(dr1);
                return -1;
            }
            
            // Open another file for writing
            sprintf(buf2, "%s/%s", path2, de1->d_name);
            
            fptr2 = fopen(buf2, "rb");
            if (fptr2 == NULL)
            {
                fptr2 = fopen(buf2, "w");
            }
            
            // Read contents from file
            char c;
            c = fgetc(fptr1);
            while (c != EOF)
            {
                fputc(c, fptr2);
                c = fgetc(fptr1);
            }
            fclose(fptr1);
            fclose(fptr2);
        }
        closedir(dr1);
        closedir(dr2);
    }
    
    if (function == 2) {
        // Perform Dedupication
        // This deduplicate function removes all of the files from the
        // second folder that have the same file name as a file in
        // the first folder.
        
        struct dirent *de1;
        struct dirent *de2;
        DIR *dr1;
        DIR *dr2;
        char buf[515];
        
        dr1 = opendir(path1);
        
        if (dr1 == NULL) //opendir returns NULL if counldn't open directory
        {
            printf( "Could not open current directory\n" );
            return -1;
        }
        
        dr2 = opendir(path2);
        
        if (dr2 == NULL) //opendir returns NULL if counldn't open directory
        {
            printf( "Could not open current directory\n" );
            return -1;
        }
        closedir(dr2);
        
        int match = 0;
        
        while (de1 = readdir(dr1) ) {
            dr2 = opendir(path2);
            while (de2 = readdir(dr2)) {
                match = strcmp(de1->d_name, de2->d_name);
                if (match == 0) {
                    //we have a file that needs to be deleted
                    sprintf(buf, "%s/%s", path2, de2->d_name);
                    remove(buf);
                    match = 0;
                }
            }
            closedir(dr2);
        }
        closedir(dr1);
    }
    printf("The program has completed.\n");
    
    //Display results of the home directories and sub files
    dr = opendir("."); //returns a pointer of DIR type
    
    if (dr == NULL) //opendir returns NULL if counldn't open directory
    {
        printf( "Could not open current directory\n" );
        return -1;
    }
    printf("Current files in Home Folder: \n");
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de->d_name);
    }
    
    //show files in input folder #2
    closedir(dr);
    dr = NULL;
    dr = opendir(path1);
    if (dr == NULL)
    {
        printf( "Could not open current directory\n" );
        return -1;
    }
    printf("Current files in %s: \n", path1);
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de -> d_name);
    }
    closedir(dr);
    
    //show files in input folder #2
    dr = NULL;
    dr = opendir(path2);
    if (dr == NULL)
    {
        printf( "Could not open current directory\n" );
        closedir(dr);
        return -1;
    }
    printf("Current files in %s: \n", path2);
    while ((de = readdir(dr)) != NULL)
    {
        printf("\t%s\n", de->d_name);
    }
    closedir(dr);
    
    return 0;
}
