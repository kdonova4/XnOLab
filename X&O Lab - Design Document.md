# Overview
X&O Lab is a Football playbook creator, allowing users to draw their own plays, formations, create a playbook from those plays and then gives them the ability to generate their own custom playsheets using the playbooks they create.

# Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TypeScript, MUI |
| **Backend** | Spring Boot |
| **Security** | Spring Security |
| **Database** | PostgreSQL |
| **Build Tools / Tooling** | Vite, Maven |
| **Deployment** | TBD (Backend), TBD (Frontend) |
| **Development** | IntelliJ, VS Code, pgAdmin 4 |
| **Version Control** | Git + GitHub |

# Core Features
- Create a Playbook
- Create/Draw a Formation
    - Allows for image upload, formation will be used as background for your custom play art
- Create/Draw a Play
    - Custom play art drawn by user, or uploaded image
- Create a custom Playsheet to be exported to excel
    - Create Situation categories for your plays
    - Customize situation section color coding
    - Customize presentation of plays (Combines formation and play columns or seperated etc.)
- Ability to copy plays from one playbook to another

# Stretch Goals
- Have more in depth play editor
    - Automatic rule checks (11 players, preset line, illegal formations etc.)
    - Snapping
    - Defensive/offenisve formations presets to draw against
- Option to share your playbooks with other "coaches"
    - A system like google drive where you can give access to other users if you mark them as coaches, you can give them edit or viewing access
- Add OAuth 2.0

# User Stories

### 1. Create a Playbook (Logged-In User)
As a Coach trying to create a playbook
I want to create a playbook 
so that I can build out my offense

### Acceptance Criteria
Given the Coach is logged in
When the coach creates the playbook
Then the playbook is associated with that coach and saved to the coaches library

### 2. Create a Play - Play-art 
As a Coach
I want to create my own play art
So that I can have control over the whole design

### Acceptance Criteria
Given the Coach is logged in and has selected a formation to put the play under and has a playbook
When the coach creates the Play art
Then the play art is drawn on top of the given formation and assigned to the playbook

### 3. Create a Play - Image Upload 
As a Coach
I want to create a play using an image I have
So that I don't have to draw out the play art

### Acceptance Criteria
Given the Coach is logged in and has created a formation to create a play on and has a playbook
When the coach creates the play with an image upload
Then the play will be saved to the playbook

### 4. Create a Formation
As a Coach
I want to be able to create a formation
So that I can build plays off of it

### Acceptance Criteria
Given the Coach is logged in and has a playbook
When the coach creates the formation
Then the Formation will be saved to that playbook

### 5. Copy Play to Another Playbook
As a Coach
I want to be able to copy a play from one playbook to another playbook
So that I don't have to make the play again

### Acceptance Criteria
Given the Coach is looged in and has two playbooks
When the coach copies and pastes the play from one playbook into another playbook
Then that play and all its details will be associated with that playbook as well

### 6. Generate a playsheet from my playbook
As a Coach
I want to be able to generate a playsheet from the plays in my playbook
So that I can use it to call plays on gameday

### Acceptance Criteria
Given the Coach is logged in and has a playbook with plays
When the Coach generates the playsheet
Then the playsheet will be downloaded as an excel file

## Database Design
- User Tables
- Playbook Table
- Play Table
- Play_Playbook Table
- Formation Table
- Playsheet Table
- Playsheet_Situations Table
- Playsheet_Situations_Play Table

#### app_user
- app_user_id serial primary key
- username varchar(50) unique not null
- email varchar(254) unique not null
- password_hash varchar(2048) not null
- disabled boolean not null default false

#### app_role
- app_role_id serial primary key
- role_name varchar(50) unique not null

#### app_user_role
- app_user_id int not null (fk)
- app_role_id int not null (fk)

#### playbook
- playbook_id serial primary key
- playbook_name varchar(50) not null
- app_user_id int not null (fk)

#### formation
- formation_id serial primary key
- formation name varchar(50) not null
- formation_image varchar(100) not null
- app_user_id int not null (fk)

#### play
- play_id serial primary key
- play_name varchar(50) not null
- formation_id int not null (fk)
- play_image varchar(100) not null
- notes varchar(5000),

### playbook_play
- playbook_play_id serial primary key
- playbook_id int not null (fk)
- play_id int not null (fk)

#### playsheet table
- playsheet_id serial primary key
- playsheet_name varchar(50) not null
- app_user_id int not null (fk)
- playbook_id int not null (fk)
- created_at timestamp not null
- updated_at timestamp

#### playsheet_situation
- playsheet_situation_id serial primary key
- situation_name varchar(50) not null
- situation_color varchar(50) not null
- playsheet_id int not null (fk)

#### playsheet_situation_play
- playsheet_situation_play_id serial primary key
- playsheet_situation_id int not null (fk)
- play_id int not null (fk)

## Validations

#### app_user
- username must be unique and between 8 and 16 characters
- email must be unique and valid
- password must be at least 8 characters, no more than 20

#### playbook
- playbook name must exist
- user must exist to associate with playbook
- playbook name must be unique from the user's other playbook names

#### formation
- formation name must exist
- formation image must exist
- formation name must be unique from the user's other formations

#### play
- play name must exist
- formation must exist to associate with play
- play image must exist
- notes must not exceed 1000 characters

#### playbook_play
- playbook must exist
- play must exist
- combination of playbook and play must be unique, no duplicate plays in one playbook

#### playsheet
- playsheet name must exist
- user must exist to associate with the playsheet
- playbook must exist to associate with the playsheet
- created must exist and cannot be in the future
- updated at cannot be in the future

#### playsheet_situation
- situation name must exist
- situation color must exist
- playsheet must exist to associate with playsheet_situation

#### playsheet_situation_play
- playsheet_situation must exist
- play must exist
- combination of playsheet_sitaution and play is unique, no duplicate plays under the same situation

## Backend Design

### Models

#### AppUser
```
private Long appUserId;
private String username;
private String email;
private String password;
private Set<Role> roles;
private List<Playsheet> playsheets;
private List<Formation> formations;
private List<Playbook> playbooks;
```


#### Userdetails
```
private static final long serialVersionUID= 1L;
private Long id;
private String username;
private String email;

public static UserDetailsImpl build(User user)
public Collection<? extends GrantedAuthority> getAuthorities()
public String getPassword()
public String getUsername()
public boolean isAccountNonExpired()
public boolean isAccountNonLocked()
public boolean isCredentialsNonExpired()
public boolean isEnabled()
public boolean equals(Object o)
```

#### AppRole
```
private Long roleId;
private String roleName;
```

#### Playbook
```
private Long playbookId;
private String playbookName;
private AppUser user;
List<Play> plays
```

#### Formation
```
private Long formationId;
private String formationName;
private String formationImageUrl;
private String formationImagePublicId;
private AppUser user;
```

#### Play
```
private Long playId;
private String playName;
private String playImageUrl;
private String playImagePublicId;
private String notes;
private Formation formation;
private Playbook playbook;
private AppUser user;
```

#### Playsheet
```
private Long playsheetId;
private String playsheetName;
private Timestamp createdAt;
private Timestamp updatedAt;
private AppUser user;
private Playbook playbook;
private List<PlaysheetSituation> situations;
```

#### PlaysheetSituation
```
private Long playsheetSituationId;
private String situationName;
private String situationColor;
private Playsheet playsheet;
private List<PlaysheetSituationPlay> plays;
```

#### PlaysheetSituationPlay
```
private Long playsheetSituationPlayId;
private PlaysheetSituation playsheetSituation;
private Play play;
```

### DTOs

#### UserInfoResponse
```
private Long id;
private String jwtToken;
private String username;
private List<String> roles;
```

#### MessageResponse
```
private String message;
```

#### LoginRequest
```
private String username;
private String password;
```

#### SignUpRequest
```
private String email;
private String username;
private String password;
private Set<String> roles;
```

#### PlaybookCreateDTO
```
private String playbookName;
```

#### PlaybookResponseDTO
```
private Long playbookId;
private String playbookName
private List<PlayResponseDTO> plays;
```

#### PlaybookUpdateDTO
```
private String playbookName;
```

#### FormationCreateDTO
```
private String formationName;
```

#### FormationResponseDTO
```
private Long formationId;
private String formationName;
private String formationImageUrl;
```

#### FormationUpdateDTO
```
private String formationName;
```

#### PlayCreateDTO
```
private String playName;
private String playNotes;
private Long formationId;
private Long playbookId;
```

#### PlayUpdateDTO
```
private String playName;
private String playNotes;
private Long playbookId;
```

#### PlayResponseDTO
```
private Long playId;
private String playName;
private String playImageUrl;
private String playNotes;
private FormationResponseDTO formation;
```

#### PlaysheetCreateDTO
```
private String playsheetName;
private Long playbookId;
private List<PlaysheetSituationCreateDTO> situations;
```

#### PlaysheetResponseDTO
```
private Long playsheetId;
private String playsheetName;
private Timestamp createdAt;
private Timestamp updatedAt
private PlaybookResponseDTO playbook;
private List<PlaysheetSituationResponseDTO> situations;
```

#### PlaysheetUpdateDTO
```
private String playsheetName;
private List<PlaysheetSituationUpdateDTO> situations;
```

#### PlaysheetSituationCreateDTO
```
private String situationName;
private String situationColor;
private Long playsheetId;
private List<Long> playIds;
```

#### PlaysheetSituationResponseDTO
```
private Long playsheetSituationId;
private String situationName;
private String situationColor;
private Long playsheetId;
private List<PlaysheetSituationPlayResponseDTO> plays;
```

#### PlaysheetSituationUpdateDTO
```
private Long playsheetSituationId;
private String situationName;
private String situationColor;
private List<Long> playIds;
```

#### PlaysheetSituationPlayCreateDTO
```
private Long playId;
private Long playsheetSituationId;
```

#### PlaysheetSituationPlayResponseDTO
```
private PlayResponseDTO play;
```


### Repositories

#### AppUserRepo
```
Optional<AppUser> findByUsername(String username);
boolean existsByEmail(String email);
boolean existsByUsername(String username);
```

#### AppRoleRepo
```
Optional<AppRole> findByRoleName(String roleName);
```

#### PlaybookRepo
```
List<Playbook> findByUser_AppUserId(Long userId);
Optional<Playbook> findByPlaybookName(String playbookName);
```

#### FormationRepo
```
Optional<Formation> findByFormationName(String formationName);
List<Formation> findByUser_AppUserId(Long userId);
List<Formation> findByUser_AppUserId(Long userId);
```

#### PlayRepo
```
Optional<Play> findByPlayName(String playName);
List<Play> findByFormation_FormationId(Long formationId);
List<Play> findByPlaybook_PlaybookId(Long playbookId);
```

#### PlaysheetRepo
```
Optional<Playsheet> findByPlaysheetName(String playsheetName);
List<Playsheet> findByUser_AppUserId(Long userId);
List<Playsheet> findByPlaybook_PlaybookId(Long playbookId);
```

#### PlaysheetSituation
```
Optional<PlaysheetSituation> findBySituationName(String situationName);
List<PlaysheetSituation> findByPlaysheet_PlaysheetId(Long playsheetId);
```

#### PlaysheetSituationPlay
```
List<PlaysheetSituationPlay> findByPlaysheetSituation_PlaysheetSituationId(Long playsheetSituationId);
List<PlaysheetSituationPlay> findByPlay_PlayId(Long playId);
Optional<PlaysheetSituationPlay> findByPlaysheetSituation_PlaysheetSituationIdAndPlay_PlayId(Long playsheetSituationId, Long playId)
```

### Services

#### UserDetailsServiceImpl
```
private final UserRepository userRepository;
public UserDetails loadUserByUsername(String username)
```

#### PlaybookService
```
List<PlaybookResponseDTO> getAllPlaybooksByUser(Long userId);
PlaybookResponseDTO createPlaybook(PlaybookCreateDTO playbook);
PlaybookResponseDTO updatePlaybook(String playbookName, Long playbookId)
PlaybookResponseDTO deletePlaybook(Long playbookId);
```

#### FormationService
```
List<FormationResponseDTO> getAllFormationsByUser(Long userId);
List<FormationResponseDTO> searchByFormationName(String formationName);
FormationResponseDTO createFormation(FormationCreateDTO formation);
FormationResponseDTO updateFormation(FormationCreateDTO formation, Long formationId);
FormationResponseDTO deleteFormation(Long formationId);
```

#### PlayService
```
List<PlayResponseDTO> searchPlaysByName(String name);
List<PlayResponseDTO> getPlaysByPlaybook(Long playbookId);
List<PlayResponseDTO> getPlaysByFormation(Long formationId);
PlayResponseDTO createPlay(PlayCreateDTO play);
PlayResponseDTO updatePlay(PlayCreateDTO play, Long playId);
PlayResponseDTO deletePlay(Long playId);
```

#### PlaysheetService
```
List<PlaysheetResponseDTO> searchPlaysheetByName(String name);
List<PlaysheetResponseDTO> getPlaysheetByUser(Long userId);
List<PlaysheetResponseDTO> getPlaysheetByPlaybook(Long playbookId);
PlaysheetResponseDTO createPlaysheet(PlaysheetCreateDTO playsheet);
PlaysheetResponseDTO updatePlaysheet(PlaysheetCreateDTO playsheet, Long playsheetId);
PlaysheetResponseDTO deletePlaysheet(Long playsheetId);
```

### Controllers

#### AuthController
```
@PostMapping("/sign-in")
ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest);

@PostMapping("/sign-up")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest)

@GetMapping("/username")
public String currentUsername(Authentication authentication)

@GetMapping("/user")
public ResponseEntity<?> getUserDetails(Authentication authentication)

@PostMapping("/sign-out")
public ResponseEntity<?> signOutUser()
```

#### PlaybookController
```
@GetMapping("/playbooks/{userId}")
ResponseEntity<List<PlaybookResponseDTO>> getPlaybooksByUser(@PathVariable Long userId);

@PostMapping("/playbooks")
ResponseEntity<PlaybookResponseDTO> createPlaybook(@RequestBody PlaybookCreateDTO playbook);

@PutMapping("/playbooks/{playbookId}")
ResponseEntity<PlaybookResponseDTO> updatePlaybook(@RequestBody PlaybookCreateDTO playbook, @PathVariable Long playbookId);

@DeleteMapping("/playbooks/{playbookId}")
ResponseEntity<PlaybookResponseDTO> deletePlaybook(@PathVariable Long playbookId);
```

#### FormationController
```
@GetMapping("/formations/{userId}")
ResponseEntity<List<FormationResponseDTO>> getFormationsByUser(@PathVariable Long userId);

@GetMapping("/formations/{formationName}")
ResponseEntity<List<FormationResponseDTO>> searchFormationsByFormationName(@PathVariable String formationName);

@PostMapping("/formations")
ResponseEnitity<FormationResponseDTO> createFormation(@RequestBody FormationCreateDTO formation);

@PutMapping("/formations/{formationId}")
ResponseEnitity<FormationResponseDTO> updateFormation(@RequestBody FormationCreateDTO formation, @PathVariable Long formationId);

@DeleteMapping("/formations/{formationId}")
ResponseEntity<FormationResponseDTO> deleteFormation(@PathVariable Long formationId);
```

#### PlayController
```
@GetMapping("/plays/{playName}")
ResponseEntity<List<PlayResponseDTO>> searchPlaysByName(@PathVariable playName);

@GetMapping("/plays/{playbookId}")
ResponseEntity<List<PlayResponseDTO>> getPlaysByPlaybook(@PathVariable playbookId);

@GetMapping("/plays/{formationId}")
ResponseEntity<List<PlayResponseDTO>> getPlaysByFormation(@PathVariable formationId);

@PostMapping("/plays")
ResponseEntity<PlayResponseDTO> createPlay(@RequestBody PlayCreateDTO play)

@PutMapping("/plays/{playId}")
ResponseEntity<PlayResponseDTO> updatePlay(@RequestBody PlayCreateDTO play, @PathVariable Long playId);

@DeleteMapping("/plays/{playId}")
ResponseEntity<PlayResponseDTO> deletePlay(@PathVariable Long playId);
```

#### PlaysheetController
```
@GetMapping("/playsheets/{name}")
ResponseEntity<List<PlaysheetResponseDTO> searchPlaysheetByName(@PathVariable String name);

@GetMapping("/playsheets/{userId}")
ResponseEntity<List<PlaysheetResponseDTO>> getPlaysheetsByUser(@PathVariable Long userId);

@GetMapping("/playsheets/{playbookId}")
ResponseEntity<List<PlaysheetResponseDTO>> getPlaysheetsByPlaybook(@PathVariable Long playbookId);

@PostMapping("/playsheets")
ResponseEntity<PlaysheetResponseDTO> createPlaysheet(@RequestBody PlaysheetCreateDTO);

@PutMapping("/playsheets/{playsheetId}")
ResponseEnitity<PlaysheetResponseDTO> updatePlaysheet(@RequestBody PlaysheetUpdateDTO, @PathVariable Long playsheetId);

@DeleteMapping("/playsheets/{playsheetId}")
ResponseEntity<PlaysheetResponseDTO> deletePlaysheet(@PathVariable Long playsheetId);
```

### Controller Endpoint Chart

#### AuthController

| API Method | Endpoint | Method | Purpose | Request Body | Request Parameters | Response | Status |
|-------|-------------|----|----|----|----|---------|----|
| authenticateUser | /api/sign-in | POST | Logging in a user | LoginRequest | NONE | UserInfoResponse | OK |
| registerUser | /api/sign-up | POST | creating/register a user | SignUpRequest | NONE| MessageResponse | OK |
| currentUsername | /api/username | GET | getting requested user's username | NONE | NONE | String | OK |
| getUserDetails | /api/user | GET | getting requested user's information | NONE | NONE | UserInfoResponse | OK |
| signOutUser | /api/sign-out | POST | Sign out user | NONE | NONE | MessageResponse | OK |


#### PlaybookController
| API Method | Endpoint | Method | Purpose | Request Body | Request Parameters | Response | Status |
|-------|-------------|----|----|----|----|---------|----|
| getPlaybooksByUser | /api/playbooks/{userId} | GET | Gets all the playbooks for a given user | NONE | userId | List<PlaybookResponseDTO> | OK |
| createPlaybook | /api/playbooks | POST | Creates a playbook | PlaybookCreateDTO | NONE | PlaybookResponseDTO | CREATED |
| updatePlaybook | /api/playbooks/{playbookId} | PUT | Updates Given Playbook | PlaybookCreateDTO | playbookId | PlaybookResponseDTO | NO CONTENT |
| deletePlaybook | /api/playbooks/{playbookId} | DELETE | deletes given playbook | NONE | playbookId | PlaybookResponseDTO | NO CONTENT |


#### FormationController
| API Method | Endpoint | Method | Purpose | Request Body | Request Parameters | Response | Status |
|-------|-------------|--------------|----|----|----|---------|----|
| getFormationsByUser | /api/formations/{userId} | GET | Gets all the formations for a given user | NONE | userId | List<FormationResponseDTO> | OK |
| searchFormationsByName | /api/formations/{formationName} | GET | Searches formations by name | NONE | formationName | List<FormationResponseDTO> | OK |
| createFormation | /api/formations | POST | Creates a formation | FormationCreateDTO | NONE | FormationResponseDTO | CREATED |
| updateFormation | /api/formations/{formationId} | PUT | Updates a formation | FormationCreateDTO | formationId | FormationResponseDTO | NO CONTENT |
| deletePlaybook | /api/formations/{formationId} | DELETE | deletes given formations | NONE | formationId | FormationResponseDTO | NO CONTENT |

#### PlayController
| API Method | Endpoint | Method | Purpose | Request Body | Request Parameters | Response | Status |
|-------|-------------|----|----|----|----|---------|----|
| searchPlaysByName | /api/plays/{playName} | GET | Searches plays by name | NONE | playName | List<PlayResponseDTO> | OK |
| getPlaysByPlaybook | /api/plays/{playbookId} | GET | Gets plays by playbook | NONE | playbookId | List<PlayResponseDTO> | OK |
| getPlaysByFormation | /api/plays/{formationId} | GET | Gets plays by name | NONE | formationId | List<PlayResponseDTO> | OK |
| createPlay | /api/plays | POST | Creates a play | PlayCreateDTO | NONE | PlayResponseDTO | CREATED |
| updatePlay | /api/plays/{playId} | PUT | Updates a play | PlayCreateDTO | playId | PlayResponseDTO | NO CONTENT |
| deletePlay | /api/plays/{playId} | DELETE | deletes given play | NONE | playId | PlayResponseDTO | NO CONTENT |

#### PlaysheetController
| API Method | Endpoint | Method | Purpose | Request Body | Request Parameters | Response | Status |
|-------|-------------|----|----|----|----|---------|----|
| searchPlaysheetByName | /api/playsheets/{name} | GET | Searches playsheets by name | NONE | playsheetName | List<PlaysheetResponseDTO> | OK |
| getPlaysheetsByUser | /api/playsheets/{userId} | GET | Gets playsheets by user | NONE | userId | List<PlaysheetResponseDTO> | OK |
| getPlaysheetsByPlaybook | /api/playsheets/{playbookId} | GET | Gets playsheets by playbook | NONE | playbookId | List<PlaysheetResponseDTO> | OK |
| createPlaysheet | /api/playsheets | POST | Creates a playsheet | PlaysheetCreateDTO | NONE | PlaysheetResponseDTO | CREATED |
| updatePlaysheet | /api/playsheets/{playsheetId} | PUT | Updates a playsheet | PlaysheetCreateDTO | playsheetId | PlaysheetResponseDTO | NO CONTENT |
| deletePlaysheet | /api/playsheets/{playsheetId} | DELETE | deletes given playsheet | NONE | playsheetId | PlaysheetResponseDTO | NO CONTENT |

### Logic Flow | Frontend -> Backend

#### Playbook

##### _Create_
1. User sends request to create Playbook with PlaybookCreateDTO
2. Controller handles request sends it to service layer
3. Service layer checks validity of playbookCreateDTO
4. Service layer uses playbook repository layer to persist to database
5. Service layer sends PlaybookResponseDTO back to controller
6. Controller sends the PlaybookResponseDTO to the user

##### _Update_
1. User sends a request to update playbook
2. Controller layer handles request
3. Service layer checks if PlaybookUpdateDTO is valid and playbook exists
4. Service layer uses repository to persist new playbook and sends back new ProductResponseDTO
5. Controller layer sends the ProductResponseDTO back

#### Formation 

##### _Create_
1. User sends request to create formation with FormationCreateDTO
2. The controller layer handles request, accepts FormationCreateDTO and MultiPartFile, sends back to service
3. The formation service checks validity of formation and image, if good it will then upload image
4. If image upload is succesful then it will persist the whole formation to the db
5. The controller will send the FormationResponseDTO to the user in response

##### _Update_
1. User send request to update formation with FormationUpdateDTO
2. The controller layers handles the request, accepts FormationUpdateDTO and MultiPartFile, sends back to service
3. The formation service checks if the formation update is valid, if the file is null then then service will persist, else it will upload and confirm succesful image upload, then deletes the existing image id and then persists the new formation.
4. the controller will send the FormationResponseDTO to the user in response

#### Play

##### _Create_
1. User sends request to create play with PlayCreateDTO
2. The controller layer handles request, accepts PlayCreateDTO and MultiPartFile, sends back to service
3. The play service checks validity of play and image, if good it will then upload image
4. If image upload is succesful then it will persist the whole play to the db
5. The controller will send the PlayResponseDTO to the user in response

##### _Update_
1. User send request to update formation with PlayUpdateDTO
2. The controller layers handles the request, accepts PlayUpdateDTO and MultiPartFile, sends back to service
3. The play service checks if the play update is valid, if the file is null then then service will persist, else it will upload and confirm succesful image upload, then deletes the existing image id and then persists the new play.
4. the controller will send the PlayResponseDTO to the user in response

#### Playsheet

##### _Create_
1. User sends request with PlaysheetCreateDTO that contains PlaysheetSituationCreateDTO's which contains a list of playIds
2. Controller handles request and sends to service layer
3. Service checks whether the playsheet is valid, if yes it persists to the database
4. Then the service will loop through each of the playsheet situation to create the PlaysheetSituationCreateDTO and persisting the playsheetSituationPlays using the Id's for each situation
5. Service will then return the PlaysheetResponseDTO to the Controller layer
6. Controller layer will send response back to user

##### _Update_
1. User sends a PlaysheetUpdateDTO that contains PlaysheetSituationUpdateDTO's which contain a list of playIds
2. Controller handles request and sends to service
3. Service checks whether playsheet is valid and persists to database if yes.
4. Then service loops through each PlaysheetSituationUpdateDTO and chacks to see if they are updated, if so then update and persist and then check the play ids, if plays for that situation are added, persist the added ones, if there are plays that are persisted that are missing for the situation list of ids, then delete the playsheetSituationPlays for that play and playsheetSituation


### Error Handling

#### Result
```
private final ArrayList<String> messages = new ArrayList<>();
private ResultType type = ResultType.SUCCESS;
private T payload;

public ResultType getType() {
    return type;
}

public boolean isSuccess() {
    return type == ResultType.SUCCESS;
}

public T getPayload() {
    return payload;
}

public void setPayload(T payload) {
    this.payload = payload;
}

public List<String> getMessages() {
    return new ArrayList<>(messages);
}

public void addMessages(String message, ResultType type) {
    messages.add(message);
    this.type = type;
}
```

#### ResultType
```
SUCCESS,
INVALID,
NOT_FOUND
```

#### GlobalExceptionHandler

#### ErrorResponse
