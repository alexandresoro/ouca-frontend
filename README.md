# Où ça ? - Base Naturaliste (frontend)

This is the Angular frontend for _Où ça ?_ application.

## About the project

The aim of the _Où ça ?_ project is to provide naturalists an application where they can record and visualize their wildlife observations.

Each observation is identified by several characteristics filled in by the user: the context of the observation (e.g. date, location, weather) and the description of the observed specimens (e.g. species, age, behavior).

Gathering all these records permits naturalists to build a mapping of the fauna.

### Preview of the application

#### Recording of wildlife observations (Saisie des observations)

<img src="./doc/screenshots/saisie-des-observations.png">

#### Data visualization (Consultation des données)

<img src="./doc/screenshots/consultation-des-donnees.png">

#### Geographical area management (Gestion des lieux-dits)

<img src="./doc/screenshots/gestion-des-lieux-dits.png">

## Getting Started

This project is an Angular web application that connects to a dedicated backend API. You can find more information about this backend API in the backend project.

The application contains several features:

- Create, edit or remove data corresponding to a wildlife observation
- Search through the existing observations using advanced filtering
- Manage the different type of data related to the observations (observers, geographical area...)
- Import data from a CSV file
- Export data as a SQL dump file

### Related project

The backend for _Où ça ?_ application which is called from this frontend:

- [Où ça ? (backend)](https://github.com/ou-ca/ouca-backend)

### Deployment

1. Build the project:

```
ng build
```

This will generate the application files in the _dist/_ folder.

2. Start the application

Set the previously built _dist/_ folder as the root of your favorite web server.

The project was mainly developed with Caddy webserver in mind. You can find the template for the Caddy configuration used for the Docker configuration described below in the _docker/caddyfile_.

## Docker

This project can be run as a Docker container.

A Dockerfile is provided, and will expose the web application on port 80.

The web server also acts as a reverse proxy for the backend.

The backend location can be overridden with the following variables:

| Docker ENV variable | Default value | Explanation                          |
| ------------------- | :-----------: | ------------------------------------ |
| BACKEND_HOST        |    backend    | The URL where the backend is located |
| BACKEND_PORT        |     4000      | The port used by the backend         |

## Authors

- [Alexandre Soro](https://github.com/alexandresoro)
- [Camille Carrier](https://github.com/camillecarrier)
