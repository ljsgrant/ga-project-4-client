# SEI Project 4: Birdl (full stack web app)

## Introduction & Deployed Project

Deployed site: https://birdspotter.netlify.app/

Birdl is a full-stack web app for birdwatchers to record bird sightings, view others’ sightings, and see species distribution via interactive maps. The app uses React on the front-end, with Django REST Framework and PostgreSQL on the back-end.

This was my final project for 3-month Software Engineering Immersive course with General Assembly.

![landing page](/readme_assets/project-4-landing.png)
![bird list page](/readme_assets/project-4-allbirds.png)
![single bird page](/readme_assets/project-4-bird.png)

## Contents
Contents with links to headings here

## Brief

The brief was to:

> Build a full-stack application with a Python Django API that uses Django REST Framework to serve data from a Postgres database. This API must be consumed by a separate front-end built with React.
> There must be:
> * Multiple relationships between multiple models;
> * Full CRUD functionality;
> * The application be deployed online.

## Timeframe & Team

This was a solo project, completed over the course of 1 week. 

## Technologies Used
* React
* Python
* Django
* Django REST Framework
* PyJWT
* Sass
* Leaflet (with OpenStreetMap)
* react-leaflet
* exif-js
* Material UI
* Cloudinary
* VSCode
* Postman
* TablePlus
* Chrome DevTools
* Netlify
* Heroku

## Installation Requirements
### API:
* Python
* pip
* Pipenv
* PostgreSQL

Client:
* Cloudinary (an account is required to implement photo upload and viewing functionality – the app will run without it but photo functionality will be broken)

## Code Installation
### API:
1. Clone the [API repository](https://github.com/ljsgrant/ga-project-4-api) to your local drive
2. In the terminal, navigate to the project directory
3. Run `pipenv shell` (starts the virtual environment)
4.	Run `pipenv install` (installs dependencies from the Pipfile)
5. Run `createdb django-birdspotter` (if you choose to rename this, make sure to update the database `NAME` in the `DATABASES` dictionary in project/settings.py)
6. * If you wish to seed the database with existing test data, run `./seed.sh` (this will create a superuser for development with email: admin@admin.com and password: admin)
	* If not seeding the database, run `python3 manage.py createsuperuser` and follow the prompts to create a superuser.
7.	Run `python manage.py makemigrations` then `python manage.py migrate` (creates and applies migrations).
8.	Run `python manage.py runserver` (starts the development server – should start on port 8000 by default)

### Client (using npm – or use your own package manager as you wish):
1. Clone this repository to your local drive
2. In the terminal, navigate to the project directory
3. Run `npm install` (installs dependencies from package.json)
4. In the root directory, create a .env file containing the below, using your own Cloudinary information:
```py
REACT_APP_CLOUDINARY_CLOUD_NAME=<YOUR CLOUD NAME HERE>
REACT_APP_CLOUDINARY_UPLOAD_PRESET=<YOUR PRESET HERE>

REACT_APP_BASE_URL=http://localhost:8000 
```
5. Run `npm start` (starts the development server -  should start on port 3000 by default)
6. In your browser, navigate to http://localhost:3000/

# Development Process Write-Up
Covering some of the specifics of my build process.

## Planning
I began with a broad breakdown of the app’s core functionality:
* Users should be able to record bird sightings, and data about the sighting including timestamp and location
* Users should be able to look through a list of all birds, and view sighting data for each bird (ideally with the ability to filter by date)
* Birds should be searchable, as it is unrealistic to expect users to scroll through a list to find their desired option
* Sighting data should be displayed on a map, to visually show species distribution as recorded by users

I set myself some stretch goals, including:
* The ability to attach a photo to each sighting
* The ability for users to filter sighting data, to get insights on bird behaviour
* User comments on sightings 

### Database
My first step in planning was to make a plan for the database: which fields each model would need; what the relationships between the tables would be. I included non-essential models for my stretch goals, but greyed these out in the plan to keep them separate from the essential functionality:

![database plan](/readme_assets/project-4-planning-database.png)

### Wireframing
Next I wireframed the various pages/components, storyboarding the user’s flow through the site. Although I decided to build the site desktop-first, I tried to structure each component to make it as easy as possible to restyle for mobile screens – most components have two main containers, which could either sit side-by-side, or be stacked vertically. 

![project wireframes](/readme_assets/project-4-wireframe-storyboard.png)

As the previous two group projects for General Assembly used Material UI components fairly heavily, I was keen to take a different approach for this project and use vanilla HTML elements to build out my components wherever possible, and style them from scratch with Sass.


### Interactive Maps
As I wanted to base my core functionality around interactive maps for users to add and visualise sighting data, I knew I would need a map component. I devoted a couple of hours to researching this, looking at options including MapBox, before settling on using Leaflet, which has a React implementation, coupled with OpenStreetMap. This ticked the boxes of being free to use and open source, to avoid limiting potential functionality down the line. I spent some time getting familiar with the react-leaflet components. Map markers in react-leaflet are self-contained components that take props for latitude and longitude, so it should be possible to add any number of sightings to the map by using array.map() (no pun intended) to iterate through sightings and pass in the location values to a new Marker component for each.

### Trello
I used a Trello board to plan ahead as I went, allowing me to create my own tickets for bugs and functionality, and organise my priorities. This allowed me to stay agile throughout the project, and rapidly move from one task to the next, whilst keeping sight of my broader progress through the project.

![trello board](/readme_assets/project-4-trello-2.png)

I also kept a pad of paper on my desk for taking quick notes and pseudocoding problems before writing any code. Between my wireframes, database plan, Trello board, and making sure to psuedocode problems before tackling them in VSCode, I was able to manage my time effectively throughout the project.

## Coding

### General approach & process
I devoted half a day to planning, before establishing separate repositories for the front-end and back-end, each with a main branch and a development branch plus feature branches. Then I began to build out the core functionality of the API before starting work on the front-end, and developing new features and stretch goals across the front- and back-end simultaneously. As I had less experience with Django compared to Express, I proceeded cautiously and worked methodically to avoid making silly mistakes that would cost me time later. I kept the Django documentation open for quick reference, and made sure to commit regularly.

### Back-End: Registration and Login
I began work on the API by setting up authentication:
* I installed Django Rest Framework and started a new app for users and authentication with JWT.
* I set up a User model, which inherits from Django’s `User` class via `AbstractUser`, and set the AUTH_USER_MODEL in the project settings.py to use this extended model. 
* I created a `JWTAuthentication` class to check incoming requests for a Bearer token, and decode the token using HS256. In the project settings.py I added this to the `DEFAULT_AUTHENTICATION_CLASSES` field in `REST_FRAMEWORK`.
* I created a `UserSerializer` with a function to validate and hash users’ passwords – this: 
  * checks the password and password confirmation for equality, and validates the password with Django’s `auth.password_validation.validate_password` method, raising a ValidationError if either of these checks fail; 
  * uses the `make_password` method to hash and salt the password before returning the data with the encrypted password.
* I added Views and URLs for Register and Login, to handle POST requests to their respective endpoints. The RegisterView validates the request data and saves it to the database if it’s valid; the LoginView finds the user in the database associated with the email from the request data, raising PermissionDenied if the user doesn’t exist, and uses the check_password method to validate the incoming password. Then I create an expiry timestamp using `datetime.now()` and `timedelta()`, and generate a jwt token using `jwt.encode()`, passing in the user’s id and the expiry timestamp, and return the token in the Response.

By the end of the first day on the project I had implemented authentication, with endpoints for registration and login and functions to handle requests to these endpoints, and tested the functionality using Postman. 

### Back-End: Setting up Models and Serializers
After setting up users and authentication, I added models and endpoints for Birds and Sightings, common and populated serializers for each, and APIViews to handle requests.

I wanted to have functionality for users to be able to click on each others’ usernames and see all the sightings from that user. To achieve this I added a UserDetailView, which uses a PopulatedUserSerializer to add a sightings field to the user, giving a list of ids of the birds they have seen. This in turn uses a BirdPopulatedSightingSerializer to populate each sighting with information about the bird. 

I ended up creating multiple populated serializers for sightings, for different use-cases. This was to avoid redundantly populating fields down to an unnecessary depth: for example, if I get a list of a user’s sightings, each sighting will contain populated data for a bird, so I can show which birds a user has seen. However the populated bird also contains a list of all the sightings that have been linked to it – and I don’t want to populate these sightings, and in turn populate all the birds on each of them, and in turn all the sightings on those birds, and so on…!

This was definitely one of the more challenging parts of the API for me – following the logic through several serializers, and wrapping my head around which one needed to be used at which point took a while. To wrap my head around how to handle this in Django, I worked out the flow of logic on paper first before writing the code:

![serializers notes](/readme_assets/project-4-serializers-notes.jpeg)

And then, following the flow of logic in the code, the User is populated with Sightings, which are themselves populated with Birds using the common BirdSerializer:
```py
class UserDetailView(APIView):

   def get_user(self, pk):
       try:
           return User.objects.get(pk=pk)
       except User.DoesNotExist:
           raise NotFound(detail=f"Can't find user with key {pk}")

   def get(self, _request, pk):
       user = self.get_user(pk=pk)
       serialized_user = PopulatedUserSerializer(user)
       return Response(serialized_user.data, status=status.HTTP_200_OK)

class PopulatedUserSerializer(UserSerializer):
   sightings = BirdPopulatedSightingSerializer(many=True)

class BirdPopulatedSightingSerializer(SightingSerializer):
   bird_sighted = BirdSerializer()

class BirdSerializer(serializers.ModelSerializer):
   class Meta:
       model = Bird
       fields = '__all__'
```

### Front-End: Setup & basics
I used `Create React App` to set up the project structure, set up the API to allow Cross-Origin Resource Sharing with `django-cors-headers`, and then edited the package.json in the Client to proxy requests from the front-end development server to the API on `localhost:8000`.

I checked that I could make basic GET requests from App.js in the front end, then installed `react-router-dom` and added a BrowserRouter, created a basic Navbar component, and added a bird list, to become the list of birds and the heat maps of their sightings.

### Front-End: Login & Register
For the sake of speed, I reused some small parts of previous projects to get basic functionality in: the `useAuthenticated` custom hook for example, which checks requests for a valid token - as well as the structure of the api.js file, giving quick access to requests and endpoints.

I then built out login and register components on the front end to make POST requests to their respective endpoints in the API:
```js
const handleSubmit = async (event) => {
   event.preventDefault();
   try {
     await API.POST(API.ENDPOINTS.register, formFields);

     const loginData = await API.POST(API.ENDPOINTS.login, {
       email: formFields.email,
       password: formFields.password
     });

     AUTH.setToken(loginData.data.token);

     console.log(`Logged you in, ${formFields.username}`);
     navigate('/');
   } catch (error) {
     console.error(error);
   }
 };
```

### Bird Details, Maps to Show Sighting Data
I built out a component to view information on a single bird. As we get populated data for sightings from the API, we can view the sightings of that bird. I started by just getting sightings to show as timestamps and latitude/longitude in the right hand container. Then I worked on implementing a map component, so I could show this data visually. I installed `react-leaflet` (see [Planning section](#planning) for more on this) and added the react-leaflet MapContainer component with a TileLayer, as per the docs. And voila! …it’s broken.

![broken leaflet map](/readme_assets/project-4-broken-map.png)

This is expected – from the Leaflet documentation I know I need to import leaflet’s stylesheet for it to work, but upon doing this the map disappears entirely. At this point I took a spin on stack overflow and realised that the MapContainer has a `.leaftlet-container` className, and this needs to be given dimensions for the map to show. Makes sense. I added `.leaflet-container` to BirdDetails.scss, for now just giving it 100% width and height so I can drive its dimensions using its parent container, and we have a map:

![leaflet map](/readme_assets/project-4-map.png)

Now I just need to show the sightings of the bird as markers on the map. Inside the <MapContainer> component, I use `Array.map()` to iterate through the sightings array for the selected bird, using Optional Chaining to avoid throwing errors if the sightings array is empty, and return the Leaflet Marker component, passing in the latitude and longitude of each sighting’s location. I also included the react-leaflet Popup component, to show more details about the sighting should the user click on it:
``` jsx
            {birdData?.sightings?.map((sighting) => (
              <Marker
                key={sighting.id}
                icon={DefaultMarkerIcon}
                position={[sighting.location_lat, sighting.location_long]}
              >
                <Popup>
                  Seen by {sighting.owner} at {sighting.sighted_at_datetime}
                </Popup>
              </Marker>
            ))}
```

Success!

![markers on the map](/readme_assets/project-4-sightings-wip.png)

### Adding Interactive Maps to Input Data
To allow users to record bird sightings, I built out a NewSighting component with some form inputs and another react-leaflet map - this time with the Marker component taking `draggable={true}` as a prop, which allows it to be moved around the map - this is great functionality out of the box and really intuitive to implement. I use the dragend event to fire a `moveMarker()` function when the user has released the marker, which in turn updates some state for `markerPosition` using the built-in `getLatLng()` method from Leaflet:
```jsx
  function moveMarker(event) {
    const marker = markerRef.current;
    if (marker != null) {
      setMarkerPosition(marker.getLatLng());
    }
  }
```

### Latitude/Longitude Inputs & Marker Position
For the sake of both accessibility and precision, I added a couple of inputs for latitude and longitude, and so the user can see a readout of the current latitude/longitude, added `value={markerPosition.lng}`/`value={markerPosition.lat}` to them so they display the current marker position. I set each to fire a `handleLatLongTextChange` function on change, which in turn sets state for `markerPosition` with the new value, therefore updating the marker position if the user edits the values. 

One issue here is that if the user tries to enter a negative value and types “-” before inputting a number, Leaflet will throw an error and break the page, as it doesn’t recognise “-” as a valid coordinate. As a quick and dirty fix I threw in a conditional to only set state if the value is `!NaN`, but this isn’t ideal behaviour and I need to come back to this:
``` jsx
 const handleLatLongTextChange = (event) => {
   if (!isNaN(event.target.value)) {
     setMarkerPosition({
       ...markerPosition,
       [event.target.name]: event.target.value
     });
   }
 };
```

Finally I added a `useEffect` hook with the markerPosition as a dependency, so that whenever the marker gets moved - whether by dragging on the map or editing the lat/long inputs - this will update the `formFields` with the new values:
```jsx
  useEffect(() => {
    setFormFields({
      ...formFields,
      location_lat: markerPosition.lat,
      location_long: markerPosition.lng
    });
  }, [markerPosition]);
```

To finish off the core functionality of the NewSighting component, I added a const for the “sightings” endpoint into my api.js lib file, and a `handleSubmit` function to fire a POST request to the endpoint.

### List of All Birds
To display a list of all birds in the database, in the BirdList component I make a request to the BirdListView endpoint in the API and iterate through the results using `Array.map()` to return a BirdListCard component, passing in the names and image of the bird as props. The BirdListCard takes props for bird and `setSingleBirdData`, passed in from the parent BirdList component. I use `onMouseEnter` to call a `handleMouseEnter` function which sets state for `birdData` equal to the bird that has been passed in to the BirdListCard, effectively passing the `birdData` back to the parent BirdList:
``` js
export default function BirdListCard({ bird, setSingleBirdData }) {
 const handleMouseEnter = () => {
   setSingleBirdData(bird);
 };

 return (
   <div className='BirdListCard' onMouseEnter={handleMouseEnter}>
     <Link className='Link' key={bird.id} to={`/birds/${bird.id}`}>
       <div className='bird-name-wrapper'>
         <p>{bird.name}</p>
       </div>
       <img src={bird.image} alt={bird.name} />
       <div className='sci-name-wrapper'>
         <p className='sci-name-text'>{bird.scientific_name}</p>
       </div>
     </Link>
   </div>
 );
}
```

This means that in the right pane of BirdList, I can use this state to render whichever bird in the list the user is currently hovering their cursor over (behaviour shown here in the deployed app):

![bird list behaviour](/readme_assets/project-4-birdlist-behaviour.gif)


### Searching Birds
#### **Overview**
The list behaviour above works well for previewing the bird before proceeding to viewing a sighting, but I wanted users to be able to easily find a bird they have seen or want data for – asking them to scroll through a list of potentially hundred or thousands of results isn’t realistic, so I needed a search functionality that takes a query and returns matching birds. I liked the responsiveness of the page so far, with the ability to quickly flip through the results without leaving the page, so I wanted to have functionality that would update the list as the user types, rather than taking them to a new page. Functionality shown here in the deployed app:

![bird search behaviour](/readme_assets/project-4-bird-search.gif)

#### **API**
In the views.py for the birds app, I added a BirdSearchView to take a POST request, extract a `searchTerm` from the request body, and then `filter()` birds by bird name for any containing the `searchTerm`, using `name__icontains` to ignore case. Finally we return the filtered birds, sorted alphabetically:
``` py
class BirdSearchView(APIView):
   def post(self, request):
       body_unicode = request.body.decode('utf-8')
       body = json.loads(body_unicode)
       search_query = body['searchTerm']
       search_results = Bird.objects.filter(
           name__icontains=search_query).order_by('name')
       serialized_search_results = BirdSerializer(search_results, many=True)
       return Response(serialized_search_results.data, status=status.HTTP_200_OK)
```

> #### **Note:**
> One area of improvement I would like to add to this is the ability to filter by a field of the user’s choice, rather than the bird’s common name only. 

#### **Client**
In the Client, I added an `onChange` listener to fire a `handleSearch` function and set state for the `searchTerm` whenever the user types a new query. I added a `useEffect` to fire a POST request to the search endpoint with the `searchTerm` as the body, whenever the `searchTerm` changes: this then updates the `birdData` with the search results from the back end:
``` jsx
 const handleSearch = (event) => {
   setSearchTerm(event.target.value);
 };

 useEffect(() => {
   API.POST(API.ENDPOINTS.searchBirds, { searchTerm }, API.getHeaders)
     .then(({ data }) => {
       setBirdData(data);
     })
     .catch((err) => console.error(err));
 }, [searchTerm]);
```

### Sighting Photos
#### **Uploading Photos** 
I implemented image uploads for Sightings using Cloudinary, so users can attach a photo with their sighting and then I store/retrieve this via Cloudinary. For this I use an async function to upload the image to Cloudinary, and then await the Cloudinary response, before getting the image ID, spreading the `formFields` into a `requestBody` object, and setting the value of `formFields.image` equal to the Cloudinary image ID. 

As a tweak based on some user feedback after the project deadline, I made some slight changes to allow users to post a sighting without a photo if they want – to do this I just use a conditional, and if the user hasn’t chosen a `fileToUpload`, I just spread in `formFields` to `requestBody` without the Cloudinary upload:
``` jsx
const handleSubmit = async (event) => {
   event.preventDefault();

   let requestBody;
   if (fileToUpload) {
     const imageData = new FormData();
     imageData.append('file', fileToUpload);
     imageData.append(
       'upload_preset',
       process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
     );
     try {
       const cloudinaryResponse = await API.POST(
         API.ENDPOINTS.cloudinary,
         imageData
       );
       console.log(cloudinaryResponse.data);
       const imageId = cloudinaryResponse.data.public_id;
       requestBody = {
         ...formFields,
         image: imageId
       };
       console.log(requestBody);
     } catch (error) {
       console.error(error);
     }
   } else {
     requestBody = {
       ...formFields
     };
   }

   API.POST(API.ENDPOINTS.sightings, requestBody, API.getHeaders())
     .then(({ data }) => {
       console.log(data);
       console.log('created sighting!');
       navigate(`/birds/${formFields.bird_sighted}`);
     })
     .catch((error) => console.error(error));
 };
```

#### **Displaying Photos**
To display the photos from Cloudinary, I made a component for UserSightingPhoto, which takes a `cloudinaryImageId` as props and makes a GET request to Cloudinary for the photo. I used this component in the map popup – so clicking on a sighting will show the photo – and when displaying the full details of a sighting.

### Using Photo Metadata for Timestamps
Although users can input a time and date for a sighting, I thought about how this would work in reality: although some users might record any sightings the moment they happen, others may input sightings later that day, or even take a bunch of photos of birds one day and only come to recording them months later, at which point accurately inputting the timestamp for each sighting manually could be a long, difficult task.

Knowing that common image formats contain metadata on when and how the photo was taken, I realised it should be possible to use the image’s own timestamp as the `sighted_at_datetime`. Provided the timestamp was correct (and users would be able to verify that it was before posting the sighting), this would make for a really accurate way of recording sightings - users could take a bunch of photos over the course of a day, then when they came to upload their sightings, the app would know exactly when each bird was seen from the photo metadata. 

Functionality in the deployed site:

![setting sighting timestamp from photo metadata](/readme_assets/project-4-jpeg-timestamp.gif)

I considered handling this through Cloudinary, as it is possible to use the Cloudinary upload preset to return the photo metadata in the response - but I wanted the user to be able to check the timestamp before posting the sighting, so this would require the unnecessary complexity of posting to Cloudinary every time the user chose a new file, regardless of whether they post the sighting with that photo. I decided it was far easier to just handle this in the client. 

I first planned out the functionality:

![planning out timestamp from metadata functionality](/readme_assets/project-4-planning-timestamp.png)

After quickly researching a few options for getting metadata on the front end, I installed the `exif-js` package. I targeted the file input element with a `useRef` hook, and then added a checkbox with an `onChange` listener to call a function that handles the checkbox, gets the timestamp from the metadata using the `EXIF.getData()` method, and sets the `formFields` with the `metadataTimestamp`: 
``` jsx
const handleDateTimeCheckbox = (event) => {
   setIsDateTimeInputDisabled(event.target.checked);

   const fileInput = fileInputRef.current;
   if (event.target.checked && fileInput.files[0]) {
     EXIF.getData(fileInput.files[0], function () {
       const metadataTimestamp = EXIF.getAllTags(this).DateTime;

       //format timestamp to match data from date/time input
       const dateTimeArray = metadataTimestamp.split(' ');
       dateTimeArray[0] = dateTimeArray[0].replaceAll(':', '-');
       dateTimeArray[1] = dateTimeArray[1].split(':');
       dateTimeArray[1].splice(2);
       dateTimeArray[1] = dateTimeArray[1].join(':');
       const dataFormatTimestamp = dateTimeArray.join('T');
       setFormFields({
         ...formFields,
         sighted_at_datetime: dataFormatTimestamp
       });
     });
   } else {
     setFormFields({
       ...formFields,
       sighted_at_datetime: null
     });
   }
 };
```

Finally in the UI, I wrapped the date input field in a ternary to render the input if the box is not checked, and otherwise render the `sighted_at_datetime`, which will always be the timestamp from the metadata when it is shown. I also format the `sighted_at_datetime` to make it more readable for users (including changing the date from yyyy/mm/dd to dd/mm/yyyy):

``` jsx
{isDateTimeInputDisabled ? (
                 <p>
                   {formFields.sighted_at_datetime &&
                     formFields.sighted_at_datetime
                       .split('T')[0]
                       .split('-')
                       .reverse()
                       .join('/') +
                       ' at ' +
                       formFields.sighted_at_datetime.split('T')[1]}
                 </p>
               ) : (
                 <input
                   id='sighted-at-datetime'
                   name='sighted_at_datetime'
                   type='datetime-local'
                   onChange={handleTextChange}
                   disabled={isDateTimeInputDisabled}
                   required
                 />
               )}
```

### Single Sighting Modal
To view more details about a single sighting, I considered taking the user to a new page, but decided instead to use a modal to display the sighting over the map, to avoid interrupting the user’s flow and enable them to quickly and easily check out several sightings. 

![opening and closing the sighting modal](/readme_assets/project-4-modal-open-close.gif)

I began by creating a basic component with a container, that took a sighting ID as props so I could make a GET request for the sighting data when the modal was opened from a given sighting. As I wanted the modal to sit above the entire site’s UI when opened, I imported it into App.js and added some state for a bird ID as well as state to track if the modal is open or closed:
```jsx
 const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
 const [sightingIdForModal, setSightingIdForModal] = useState(null);
```
Then in the return of App.js, I use the logical `&&` operator to only render the modal if `isSightingModalOpen` evaluates to true:
```jsx
{isSightingModalOpen && (
         <ViewSingleSightingModal
           sightingId={sightingIdForModal}
           setIsModalOpen={setIsSightingModalOpen}
           setIsBirdDataUpdated={setIsBirdDataUpdated}
         />
       )}
```
Now, passing `setSightingIdForModal` and `setIsSightingModalOpen` as props from App.js to the MapPopup (or any other component that I want to be able to open the modal) means that when the user clicks the button to open the modal, we can pass data up to App.js via `setState()` calls, toggle the visibility of the modal, and then pass the sighting data down to the modal as props.

The button in MapPopup to open the modal:
``` js
         <button
           className='button-style-2'
           value={sightingData?.id}
           onClick={handleOpenSightingModal}
         >
           View Details
         </button>
```
Handling opening the modal & setting state in MapPopup:
``` js
export default function MapPopup({
 sightingData,
 setSightingIdForModal,
 setIsSightingModalOpen
}) {
 const handleOpenSightingModal = (event) => {
   setSightingIdForModal(event.target.value);
   setIsSightingModalOpen(true);
 };
```
The modal component then makes an API request for the sighting data whenever a new sighting is selected, via a `useEffect` hook with the `sightingId` as a dependency. 

#### **Modal Layout & Styling**

To get the modal to hover over the site I made a parent div in the component, and added some basic styling in a scss file. I set its position to absolute, gave it a translucent `background-color`, set `width` and `height` to 100%, and used Flexbox to center any child elements. Using this as the background element means the rest of the site appears greyed out when the modal is open, and locks out the underlying UI until the modal is closed. To ensure it always appears over other elements – including the Leaflet MapContainer, with its high z-index – I gave the modal a z-index of 1100.

Then I added a child div which would be the actual container for the modal UI, setting its width and height to `50vw` and `80vh` respectively, before building out the content with fields from the sighting data.

#### **Modal Tabs**
To avoid cluttering the modal, I made a tab UI so users can toggle between the photo of the sighting, and the map (which has its center locked to the sighting, so the user can only zoom in & out, to avoid them “losing” the sighting on the map): 

![toggling between the modal tabs](/readme_assets/project-4-modal-tabs.gif)

Map and photo tabs:
``` jsx
<button ref={photoButtonRef} onClick={showPhoto}>
                     Photo
                   </button>
                   <button
                     ref={mapButtonRef}
                     className='unclicked-tab'
                     onClick={showMap}
                   >
                     Map
                   </button>
```
Functions to handle clicking on each of the tabs:
``` jsx
 const showPhoto = () => {
   const photoButton = photoButtonRef.current;
   const mapButton = mapButtonRef.current;
   photoButton.classList.remove('unclicked-tab');
   mapButton.classList.add('unclicked-tab');
   setIsPhotoOpen(true);
   setIsMapOpen(false);
 };
 const showMap = () => {
   const photoButton = photoButtonRef.current;
   const mapButton = mapButtonRef.current;
   photoButton.classList.add('unclicked-tab');
   mapButton.classList.remove('unclicked-tab');
   setIsPhotoOpen(false);
   setIsMapOpen(true);
 };

```
I also added controls for editing and deleting the sighting, which are conditionally rendered depending variously on if the user owns the sighting or is an admin:
``` js
{AUTH.getPayload().sub === sightingData?.owner.id && (
                     <Link to={`/edit-sighting/${sightingData?.id}`}>
                       <button onClick={handleClose}>Edit Sighting</button>
                     </Link>
                   )}
                   {(AUTH.getPayload().sub === sightingData?.owner.id ||
                     AUTH.getPayload().isAdmin) && (
                     <button onClick={handleDeleteAlertOpen}>
                       Delete Sighting
                     </button>
                   )}
```

![buttons to edit and delete a sighting](/readme_assets/project-4-edit-delete-sighting-controls.png)

To allow me to get the value of `isAdmin` for the current user in the client, in the API LoginView I encode this field into the token from the user’s data as they log in: 
``` py
token = jwt.encode(
           {'sub': user_to_login.id, 'exp': int(
               timestamp.strftime('%s')), 'isAdmin': user_to_login.is_staff, 'username': user_to_login.username},
           settings.SECRET_KEY, algorithm='HS256'
       )
```
### Editing Sightings
Clicking on “edit sighting” in the sighting modal will close the modal and open an Edit Sighting page for the id of that sighting. This is largely just a tweaked version of the NewSighting component, with a couple of changes.

To allow the user to make changes to their existing data, I get the sighting ID with `useParams`, and pass it to a GET request for the sighting, before populating the `formFields` with that sighting’s info and placing the draggable map marker at the currently recorded sighting location:
``` js
useEffect(() => {
   API.GET(API.ENDPOINTS.singleSighting(id))
     .then(({ data }) => {
       console.log(data);
       setInitialSightingData(data);
       setFormFields({
         bird_sighted: data.bird_sighted.id,
         sighted_at_datetime:
           data.sighted_at_datetime.length > 16
             ? data.sighted_at_datetime.slice(0, 16)
             : data.sighted_at_datetime,
         location_lat: data.location_lat,
         location_long: data.location_long,
         notes: data.notes,
         image: data.image
       });
       setMarkerPosition({
         lat: data.location_lat,
         lng: data.location_long
       });
     })
     .catch((err) => console.error(err));
 }, [id]);
```

Submitting the form will then make a PUT request to the `singleSighting` endpoint, again passing in the id from `useParams`.


### Deleting Sightings
I added functionality to ask the user to confirm deletion of a sighting, and giving them an option to cancel the deletion. For time’s sake at this point, I installed Material UI and added in a dialog component I had used on a previous project, copying most of the logic over:

![delete sighting confirmation alert](/readme_assets/project-4-delete-alert.png)

### Adding Map Filters
The ability to filter map data by various parameters was one of my main stretch goals, so I was happy to find the time near the end of the project to build in this functionality! This lets users filter the sighting markers:
* To show only sightings between two dates (useful for seeing if birds are only present in summer or winter for example); 
* To show only sightings between two times of day (for example, users could view only nocturnal sightings);
* To filter by the user’s own sightings only, hiding sightings by other users.

Functionality in the deployed site:

![setting and clearing sighting filters](/readme_assets/project-4-map-filters.gif)

To achieve this, in the API I created an APIView called `BirdFilteredSightingsView`, with a function to handle a POST request, and added a `filtersightings/` endpoint into the urls.py. This function gets a bird for a given primary key, and stores its list of sightings in a `filtered_sightings` variable. Then I use if statements to check if values for each of the filters evaluate to true or false:
```py
if body['byMySightings']:
```
``` py
if body['dateFrom'] and body['dateTo']:
```
``` py
if body['timeFrom'] and body['timeTo']:
```
If a value evaluates to true, I use the `filter()` method to iterate through the `filtered_sightings` list, filtering the list for the given data, before setting `filtered_sightings` as equal to the results. 

#### **Filtering sightings by date range**
For example, to filter by a date range I format the `dateFrom` and `dateTo` as numbers (i.e. 2022-04-21 would become 20220421), before defining a function to check if the sighting’s timestamp is greater than the `dateFrom` timestamp and less than the `dateTo` timestamp – this function also extracts the date from the `sighted_at_datetime` and formats it in the same way as above. I pass this function into the `filter()` method as the test to filter by, along with the `filtered_sightings` as the list to filter, before finally setting `filtered_sightings` equal to the filtered list:
``` py
       if body['dateFrom'] and body['dateTo']:
           formatted_date_from = body['dateFrom'][0:10].replace("-", "")
           formatted_date_to = body['dateTo'][0:10].replace("-", "")

           def check_if_in_date_range(list_item):
               formatted_list_item = list_item['sighted_at_datetime'][0:10].replace(
                   "-", "")
               if formatted_list_item > formatted_date_from and formatted_list_item < formatted_date_to:
                   return True
               else:
                   return False
           sightings_iterator = filter(
               check_if_in_date_range, filtered_sightings)
           filtered_sightings = list(sightings_iterator)
```

#### **Filtering sightings by time range**
I use similar logic to handle filtering by a time range, but here I needed to account for the fact that if the time range includes midnight, the `formatted_time_from` will be greater than the `formatted_time_to`. I started by working through a solution in pseudocode…

![filter by time pseudocode](/readme_assets/project-4-planning-filter-time.jpeg)

…then I coded this out, defining two functions to pass into the `filter()` method depending on whether the time range includes or excludes midnight:
* `check_if_in_time_range_incl_midnight`, which returns `True` if the `formatted_list_item` is greater than the `formatted_time_from` *OR* is less than the `formatted_time_to`;
* `check_if_in_time_range_excl_midnight`, which returns `True` if the list item is greater than the `formatted_time_from` *AND* less than the `formatted_time_to`.

When calling the `filter()` method, I use if statements to check whether the `formatted_time_from` is greater or less than the `formatted_time_to` (indicating if the range includes midnight), and pass one or other of the two functions in accordingly:
``` py
           if formatted_time_to < formatted_time_from:
               sightings_iterator = filter(
                   check_if_in_time_range_incl_midnight, filtered_sightings)
               filtered_sightings = list(sightings_iterator)
           if formatted_time_to > formatted_time_from:
               sightings_iterator = filter(
                   check_if_in_time_range_excl_midnight, filtered_sightings)
               filtered_sightings = list(sightings_iterator)
```

#### **Returning filtered data**
Finally once all filters have been applied, I replace the bird’s list of sightings with the `filtered_sightings` before returning the bird in the Response:
``` py
       bird_data = serialized_bird.data
       bird_data['sightings'] = filtered_sightings

       return Response(bird_data, status=status.HTTP_200_OK)
```

#### **Implementing map filters in the front-end**
In the BirdDetails component I added some state for filters, initialising this as an object with default values which will evaluate to false in the API:
```js
 const [filters, setFilters] = useState({
   forBirdId: '',
   byMySightings: false,
   dateFrom: '',
   dateTo: '',
   timeFrom: '',
   timeTo: ''
 });
```
I created inputs for each of the filters, with event listeners to handle the user changing the filter values:
```js
 const handleTimeDateFilterChange = (event) => {
   setFilters({ ...filters, [event.target.name]: event.target.value });
 };
```
I added buttons to apply and clear the filters, which have `onClick` listeners to fire `handleApplyFilters()` and `handleRemoveFilters()` functions respectively. 
* `handleApplyFilters()` makes the POST request to the `filtersightings` endpoint with the `filters` and `birdId` as the request body, then updates the state for `birdData` with the response data. It also sets `areFiltersApplied` to true.
* `handleClearFilters()` sets state for `filters` back to empty & falsy values, and makes a standard GET request for the bird, updating the state for `birdData` with the full, unfiltered bird and its sightings. It also sets `areFiltersApplied` to false.

Finally, for each input I set the disabled property equal to areFiltersApplied, so when filters are applied, their values can’t be changed until the Clear All button is clicked:

![applying and clearing map filters](/readme_assets/project-4-map-filters-closeup.gif)

### Styling
To handle fonts, I made a FontStyles.scss Sass file and imported it into App.js, so I could easily control the fonts across the entire site. I used a _variables.scss file to control the size of elements and theme colours across multiple pages, and used this to build out a consistent visual theme based around the light sea green, dark blue and light grey. 

I continued a rounded-corner aesthetic for containers throughout the site, and made a containerStyles.scss file with several utility classes so I could quickly apply these styles to various containers. I also created a buttonStyles.scss file with utility classes for styling up buttons of different dimensions and in different contexts.

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| :-------------------------:|:-------------------------: |
| ![bird container](/readme_assets/project-4-containerstyle-1.png) ![bird container](/readme_assets/project-4-containerstyle-2.png)  | ![new sighting container](/readme_assets/project-4-containerstyle-3.png) ![bird container 2](/readme_assets/project-4-containerstyle-5.png) | 

One of my biggest areas for future improvement with the styling is the current lack of responsive design – in hindsight going for a mobile-first design approach would have been best. Also the form on the NewSighting page is currently very rough, with inconsistent layout and styling for text and inputs.

### Final Tweaks
* I broke the map popup out into its own component, and fixed its behaviours so it won’t load a broken photo if there is no photo - instead rendering text “no photo for this sighting”. 
* I built out the landing page, using conditional rendering to display a different message depending on if user is logged in, and greet the user by their username if they are.


## Future Improvements
* Although I’m generally happy with the theme of the site and pleased with some of my styling, the biggest issue with the current version of the app is the lack of responsive design. To maximise my learning experiences on this project I focussed more on polishing features than on styling, and in hindsight going for a mobile-first design approach may have been best for maximum functionality with less extra work. 
* The styling for the form on the NewSighting page is still rough, with inconsistent layout and styling for text and inputs. 
* Populating the database with birds from an existing dataset, to avoid the need to manually add each species.
* The addition of an “admin controls” section of the site, accessible only by users with `isStaff=True`. This would allow administrators to add new birds to the database, and edit existing birds.
* The ability for users to request birds to be added to the database – probably by submitting a bird for review and approval by admin users.
* Currently the photo field of each bird links to a single image of the bird from Wikipedia. It would be better to rework this to have images hosted locally and the ability to show several photos for each bird.
* The addition of more fields for bird information, such as “behaviour”, “size”, “colouring”, etc., to help users find information more quickly and aid accessibility.
* I haven’t implemented a loading spinner for all components that need it – most noticeably when adding a sighting, the page hangs while the component uploads the photo to Cloudinary and awaits the response. 

## Bugs
* When creating a sighting, if the user clicks the button to post the sighting several times, it is possible to upload several of the same photo to Cloudinary before the sighting is posted to the database. The easiest fix for this is probably setting a boolean `isSubmitted` when the user clicks the button, and only execute the `handleSubmit` function if `isSubmitted === false`. 

## Takeaways & Key Learnings
* Overall this project gave me a good boost of confidence in my ability to work through problems without teammates to turn to for help, and forced me to tackle the aspects of full-stack development I was less confident with. I can really notice the improvements to my skillset after confronting and overcoming the challenges of this project.
* Working solo for this project meant that, without teammates and the need to communicate about progress at every step of the way, there was the temptation to rush from one thing to the next without fully finishing a feature, or to get side-tracked on a new piece of functionality that wasn’t in the scope of my original plan. This felt at times like I could run the risk of losing track of the bigger picture or causing self-inflicted scope-creep. I found it really helpful on this project to essentially behave as though I was working in a team. I created deadlines for myself, made sure I was accurately tracking my progress on my Trello board, and reviewed my work at each stage before progressing to the next task. This helped me hold myself accountable for finishing each feature as completely as possible in the time available.
* Working methodically and testing functionality at each step can feel slow, especially when short on time – but thoroughly checking one block of code before starting on the next one makes it easier to catch bugs earlier. This saves so much time on debugging later, and especially when working with unfamiliar technologies.
