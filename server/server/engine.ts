import fs from 'fs';
import path from 'path';
import http, { IncomingMessage, Server, ServerResponse } from 'http';


interface Organization {
    organization: String;
    createdAt: String;
    updatedAt: String;
    products: String[];
    marketValue: String;
    address: String;
    ceo: String;
    country: String;
    id: number;
    noOfEmployees: number;
    employees: String[];
}


//============GET ALL DATA===========\\

export const fetchAllData = (req: IncomingMessage, res: ServerResponse) => {
    // Read the database and fetch data

    return fs.readFile(path.join(__dirname, "database/database.json"), "utf-8", (err, info) => {
        // If there is an error, return the error
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: err
            }));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: true,
                data: JSON.parse(info)
            }));
        }
    });
};


//================ADD DATA=================\\
export const createData = (req: IncomingMessage, res: ServerResponse) => {
    let datas = '';

    req.on('data', (chunk) => {
        datas += chunk
    });
    req.on('end', () => {
        //Input data in database
        let work = JSON.parse(datas);


        let databaseFolder = path.join(__dirname, 'database');
        let databaseFile = path.join(databaseFolder, 'database.json');

        // If the databaseFolder or dataFiles do not exist, create it dynamically.
        if (!fs.existsSync(databaseFolder)) {
            fs.mkdirSync(databaseFolder);
        }
        if (!fs.existsSync(databaseFile)) {
            fs.writeFileSync(databaseFile, "");
        }
        return fs.readFile(path.join(__dirname, './database/database.json'), 'utf-8', (err, info) => {
            if (err) {
                res.writeHead(500, { "content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: false,
                    error: err
                }));
            } else {

                let organization: Organization[] = [];

                try {
                    organization = JSON.parse(info);
                } catch (parseError) {
                    organization = [];
                }

                work.createdAt = new Date();
                work.noOfEmployees = work.employees.length;
                if (organization.length === 0) {
                    work.id = 1;
                } else {
                    let Ids = organization.map((a => a.id));
                    let newId = Math.max(...Ids);
                    work.id = newId + 1;
                }
                organization.push(work);

                //Write back into the database
                fs.writeFile(path.join(__dirname, 'database/database.json'), JSON.stringify(organization, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { "content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: false,
                            error: err
                        }));
                    } else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: true,
                            message: work
                        }));
                    }

                });

            }
        });
    });
};

//=============UPDATE DATA===============\\

export const updateData = (req: IncomingMessage, res: ServerResponse) => {
    let datas = '';

    req.on('data', (chunk) => {
        datas += chunk
    });
    req.on('end', () => {
        //Input data in database
        let work = JSON.parse(datas);


        let databaseFolder = path.join(__dirname, 'database');
        let databaseFile = path.join(databaseFolder, 'database.json');

        // If the databaseFolder or dataFiles do not exist, create it dynamically.
  
        return fs.readFile(path.join(__dirname, './database/database.json'), 'utf-8', (err, info) => {
            if (err) {
                res.writeHead(500, { "content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: false,
                    error: err
                }));
            } else {

                let organization: Organization[] = JSON.parse(info)
                let updatedIndex = organization.findIndex((x => x.id == work.id))
                    organization[updatedIndex] = work             

           

                //Write back into the database
                fs.writeFile(path.join(__dirname, 'database/database.json'), JSON.stringify(organization, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { "content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: false,
                            error: err
                        }));
                    } else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: true,
                            message: work
                        }));
                    }

                });

            }
        });
    });
    
    }

    //==============DELETE DATA=============\\

    export const deleteData = (req: IncomingMessage, res: ServerResponse) => {
        let datas = '';
    
        req.on('data', (chunk) => {
            datas += chunk
        });
        req.on('end', () => {
            //Input data in database
            let work = JSON.parse(datas);
    
    
            let databaseFolder = path.join(__dirname, 'database');
            let databaseFile = path.join(databaseFolder, 'database.json');
    
            // If the databaseFolder or dataFiles do not exist, create it dynamically.
      
            return fs.readFile(path.join(__dirname, './database/database.json'), 'utf-8', (err, info) => {
                if (err) {
                    res.writeHead(500, { "content-Type": "application/json" });
                    res.end(JSON.stringify({
                        success: false,
                        error: err
                    }));
                } else {
    
                    let organization: Organization[] = JSON.parse(info)
                    let deletedIndex = organization.findIndex((x => x.id == work.id))
                    organization.splice(deletedIndex,1)      
    
               
    
                    //Write back into the database
                    fs.writeFile(path.join(__dirname, 'database/database.json'), JSON.stringify(organization, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { "content-Type": "application/json" });
                            res.end(JSON.stringify({
                                success: false,
                                error: err
                            }));
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({
                                success: true,
                                message: work
                            }));
                        }
    
                    });
    
                }
            });
        });
        
        }
    