const parser = new DOMParser()

function loadTodos() {
    //console.log("load todos")

    const responePromise = fetch("http://localhost/optimizer/src/backend/index.php/activetodos")
        .then((response) => {

            if (!response.ok) throw new Error("Unsatisfying response code " + response.statusText);

            return response.text()
        })
        .then(body => {
            //console.log("body", body);

            const xmlObject = parser.parseFromString(body, "text/xml");

            //extract all stuff from the todo
            const id = xmlObject.getElementsByTagName("id");
            const taskid = xmlObject.getElementsByTagName("taskid");
            const title = xmlObject.getElementsByTagName("title");
            const status = xmlObject.getElementsByTagName("status");
            const description = xmlObject.getElementsByTagName("description");
            const createDate = xmlObject.getElementsByTagName("createDate");
            const updateDate = xmlObject.getElementsByTagName("updateDate");
            const lastUpdate = xmlObject.getElementsByTagName("lastUpdate");

            //console.log("Fetch successfully",
            //    {
            //        id: id,
            //        taskid: taskid,
            //        title: title,
            //        status: status,
            //        description: description,
            //        createDate: createDate,
            //        updateDate: updateDate,
            //        lastUpdate: lastUpdate,
            //    })

            return xmlObject;

        })
        .catch((err) => {
            console.error("Ein Fehler in loadTodos() ist aufgetreten", err);
            return false;
        })
}

console.log("XML Test: ", loadTodos() , "\n");


async function loadTododsAsync() {
    try {
        const response = await fetch("http://localhost/optimizer/src/backend/index.php/activetodos")
        const body = await response.text()
        console.log("body", body)

        const xmlObject = parser.parseFromString(body, "text/xml")
        console.log("xml", xmlObject)

    } catch (err) {
        console.error("Ein fehler ist aufgetreten", err);
    }
}
