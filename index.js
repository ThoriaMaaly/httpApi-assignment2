let http = require('http');
let fs = require('fs');

let students = JSON.parse(fs.readFileSync("./students.json"));
let courses = JSON.parse(fs.readFileSync('./courses.json'));
let departments = JSON.parse(fs.readFileSync('./departments.json'));
let studentsWithDetails;
let server = http.createServer((req, res) => {
    const { url, method } = req;
    res.setHeader('content-type', 'application/json');

    // ***students API**************************************************************

    //********Get All students******* */
    if (url == "/students" && method == "GET") {

        res.end(JSON.stringify(students));
        res.statusCode = 200;
    }
    //********Search for student with Id ******* */
    if (url.startsWith("/students/") && method == "GET") {
        let id = Number(url.split('/')[2]);
        let stuIndx = students.findIndex((stu) =>
            stu.Id == id
        );
        if (stuIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }
        else {

            let searchedStudent = JSON.stringify(students[stuIndx]);
            res.end(searchedStudent);
            res.statusCode = 200;
        }

    }
    //********Search for students with their courses related to departmentId ******* */

    if (url.startsWith("/students?/") && method == "GET") {
        let id = Number(url.split('/')[2]);
        let searchedStudents = students.filter((stu) =>
            stu.DepartmentId == id
        );
        if (searchedStudents.length == 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }
        else {


            ///*searched depart**
            let searcheddepart = departments.filter((depart) =>
                depart.Id == id
            );
            //depart from array to object**
            searcheddepart = searcheddepart[0];

            //finding courses in the depart***
            let searchedcourses = courses.filter((coursee) =>
                coursee.DepartmentId == id
            );
            let result = { ...searchedStudents };
            result.courses=searchedcourses;
            result.department=searcheddepart;
            res.end(JSON.stringify(result));
            res.statusCode = 200;

        }
        }


    //***********Add student********** */
    else if (url == "/students" && method == "POST") {
        req.on('data', (chunk) => {
            let student = JSON.parse(chunk);
            students.push(student);
            fs.writeFileSync('./students.json', JSON.stringify(students))


        })

        res.statusCode = 201;
        res.end(JSON.stringify({ 'message': 'created' }));

    }
    // ***********Update student ***********************
    else if (url.startsWith("/students/") && method == "PUT") {
        let id = Number(url.split('/')[2]);
        req.on('data', (chunk) => {

            let student = JSON.parse(chunk);

            let stuIndx = students.findIndex((stu) =>
                stu.Id == id
            );
            if (stuIndx == -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ 'message': 'not founded' }));
            }
            else {
                students[stuIndx].Name = student.Name;
                students[stuIndx].Id = student.Id;
                students[stuIndx].Email = student.Email;
                students[stuIndx].Password = student.Password;
                students[stuIndx].DepartmentId = student.DepartmentId;


                fs.writeFileSync('./students.json', JSON.stringify(students))
                statusCode = 201;
                res.end(JSON.stringify({ 'message': 'Updated', id }));
            }


        })

    }
    //******************Delete student************** */

    else if (url.startsWith("/students/") && method == "DELETE") {
        let id = Number(url.split('/')[2]);
        let stuIndx = students.findIndex((stu) =>
            stu.Id == id
        );
        if (stuIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }

        else {

            students.splice(stuIndx, 1)

            fs.writeFileSync('./students.json', JSON.stringify(students))
            statusCode = 200;
            res.end(JSON.stringify({ 'message': ' student deleted', id }));
        }
    }

    //***********************courses API*******************/


    //**********GET ALL COURSES***** */
    if (url == "/courses" && method == "GET") {

        res.end(JSON.stringify(courses));
        res.statusCode = 200;
    }


    //********Search for courses with Id ******* */
    if (url.startsWith("/courses/") && method == "GET") {
        let id = Number(url.split('/')[2]);
        let courseIndx = students.findIndex((coursee) =>
            coursee.Id == id
        );
        if (courseIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }
        else {

            let searchedcourse = JSON.stringify(courses[courseIndx]);
            res.end(searchedcourse);
            res.statusCode = 200;
        }

    }
    //***********Add course********** */
    else if (url == "/courses" && method == "POST") {
        req.on('data', (chunk) => {
            let course = JSON.parse(chunk);
            courses.push(course);
            fs.writeFileSync('./courses.json', JSON.stringify(courses))


        })

        res.statusCode = 201;
        res.end(JSON.stringify({ 'message': 'created' }));

    }

    // ***********Update course ***********************
    else if (url.startsWith("/courses/") && method == "PUT") {
        let id = Number(url.split('/')[2]);
        req.on('data', (chunk) => {

            let course = JSON.parse(chunk);

            let courseIndx = courses.findIndex((coursee) =>
                coursee.Id == id
            );
            if (courseIndx == -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ 'message': 'not founded' }));
            }
            else {
                courses[courseIndx].Name = course.Name;
                courses[courseIndx].Id = course.Id;
                courses[courseIndx].Email = course.Email;
                courses[courseIndx].Password = course.Password;
                courses[courseIndx].DepartmentId = course.DepartmentId;


                fs.writeFileSync('./courses.json', JSON.stringify(courses))
                statusCode = 201;
                res.end(JSON.stringify({ 'message': 'Updated', id }));
            }


        })

    }
    //******************Delete course************** */

    else if (url.startsWith("/courses/") && method == "DELETE") {
        let id = Number(url.split('/')[2]);
        let courseIndx = courses.findIndex((coursee) =>
            coursee.Id == id
        );
        if (courseIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }

        else {

            courses.splice(courseIndx, 1)

            fs.writeFileSync('./courses.json', JSON.stringify(courses))
            statusCode = 200;
            res.end(JSON.stringify({ 'message': ' course deleted', id }));
        }
    }

    //***********************departments API*******************/


    //********** Get all departments***** */
    if (url == "/departments" && method == "GET") {

        res.end(JSON.stringify(departments));
        res.statusCode = 200;
    }


    //********Search for departments with Id ******* */
    if (url.startsWith("/departments/") && method == "GET") {
        let id = Number(url.split('/')[2]);
        let departIndx = students.findIndex((depart) =>
            depart.Id == id
        );
        if (departIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }
        else {

            let searcheddepart = JSON.stringify(departments[departIndx]);
            res.end(searcheddepart);
            res.statusCode = 200;
        }

    }
    //***********Add department********** */
    else if (url == "/departments" && method == "POST") {
        req.on('data', (chunk) => {
            let department = JSON.parse(chunk);
            departments.push(department);
            fs.writeFileSync('./departments.json', JSON.stringify(departments))


        })

        res.statusCode = 201;
        res.end(JSON.stringify({ 'message': 'created' }));

    }

    // ***********Update department ***********************
    else if (url.startsWith("/departments/") && method == "PUT") {
        let id = Number(url.split('/')[2]);
        req.on('data', (chunk) => {

            let department = JSON.parse(chunk);

            let departIndx = departments.findIndex((depart) =>
                depart.Id == id
            );
            if (departIndx == -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ 'message': 'not founded' }));
            }
            else {
                departments[departIndx].Name = department.Name;
                departments[departIndx].Id = department.Id;
                departments[departIndx].Email = department.Email;
                departments[departIndx].Password = department.Password;
                departments[departIndx].DepartmentId = department.DepartmentId;


                fs.writeFileSync('./departments.json', JSON.stringify(departments))
                statusCode = 201;
                res.end(JSON.stringify({ 'message': 'Updated', id }));
            }


        })

    }
    //******************Delete department************** */

    else if (url.startsWith("/departments/") && method == "DELETE") {
        let id = Number(url.split('/')[2]);
        let departIndx = departments.findIndex((depart) =>
            depart.Id == id
        );
        if (departIndx == -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({ 'message': 'not founded' }));
        }

        else {

            departments.splice(departIndx, 1)

            fs.writeFileSync('./departments.json', JSON.stringify(departments))
            statusCode = 200;
            res.end(JSON.stringify({ 'message': ' depatment deleted', id }));
        }
    }


})




//******server****** */
server.listen(3000, () => {
    console.log('server is run...')


})