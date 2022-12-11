# Unit Testing

### Purpose

The purpose of this documentation is to provide a detailed guide on writing unit tests along with the code examples.

This documentation covers unit testing examples for:

- [Services](#services)

  - Helper Services
  - API Services

- [Components](#components)

  - Smart Components
  - Dumb Components

- [Pipes](#pipes)

  - Custom Pipes
  - Build-in Pipes (pure)
  - Build-in Pipes (impure)

- [Guards](#guards)

- [Directives](#directives)

  - Attribute Directives
  - Structural Directives

- [NgRx Store](#NgRx-store) _(Includes introduction to Marble Testing)_
  - Reducers
  - Effects
  - Selectors

### Code coverage

- All public methods within a typescript class (created by you) require a unit test.
- Target to have atleast 70-80% code coverage.
- Code coverage report could be generated in an html format while executing the tests.
- Test both positive and negative cases.

### Test name

- Name your Unit Test method appropriately.
- Your method name should describe the method being tested.
- Should describe the scenario under which it’s being tested.
- The expected behavior when the scenario is invoked.

### Unit Test cases should run fast

- Highly recommended to follow [SOLID](https://en.wikipedia.org/wiki/SOLID) design principles of object-oriented programming.
- Prefer **_single responsibility functions._**
- Small functions are easier to test and maintain.
- Small functions promote readability and reusability.
- Small functions help to avoid hidden bugs.

### Isolated Unit Test

- Unit test cases are meant only for a given function and its business logic.
- It should be created and run removing any external dependencies leveraging mocking the dependencies.

### Structure your Test

- Structure your test with expected and actual results elements properly.
- Structure your Test as per patterns like **_Given-When-Then_** or **_AAA(Arrange- Act- Assert)._**

### Test Data for Unit test

- Prefer a helper method to set up test data for your test if needed.
- This will improve reusability and readability instead of setting up too much in each test set up.

### Test only Public Functions/Methods

- Test public API of your typescript classes.
- Private method logic can be tested simply using Public interface and including all possible scenarios.

### Do not

- Do not test auto-generated code.
- Do not test third-party code if you are not owning it.
- No need to test the DOM, unless you are testing an attribute directives.

### Preferred external lib to mock dependencies

This external testing lib [ng-mocks](https://www.npmjs.com/package/ng-mocks) already installed in our project is useful to mock dependencies such as modules, providers, components, pipes, directives etc.
_However, it is entirely your choice if you prefer to mock dependencies manually yourself._

_Example:_

```
import { MockDirective, MockModule, MockComponents, MockProvider, MockDirective } from 'ng-mocks';

beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockModule(ModuleName)],
      declarations: [MockComponent(ComponentName), MockDirective(DirectiveName), MockPipe(PipeName)],
      providers: [MockProvider(ServiceName)],
    });
  });

  // Can also import MockComponent(s), MockProvider(s)... to mock more than one component, service etc

```

---

### Services:

##### Helper services

Helper services should be tested the same way as other public methods of components.

_Example:_

```
@Injectable({
 providedIn: 'root'
})
export class UserRolesHelperService {
    public isAdmin(user: User): boolean {
        return user && user.permissions.some((x) => x === UserRole.ADMIN);
    }
}
```

```
import { TestBed } from '@angular/core/testing';
import { UserRolesHelperService } from './user-roles.service';
const mockAdminUser = {
  id: '123',
  permissions: ['admin']
};
const mockANotdminUser = {
  id: '123',
  permissions: ['user']
};
describe('UserRolesHelperService', () => {
  let service: UserRolesHelperService;
  beforeEach(() => {
    service = TestBed.get(UserRolesHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false if user is not an admin', () => {
    expect(service.isAdmin(mockANotdminUser)).toBe(false);
  });

  it('should return true if user is admin', () => {
    expect(service.isAdmin(mockAdminUser)).toBe(true);
  });
});
```

##### REST API SERVICES

Angular provides several utilities for intercepting and mocking http calls in the test suite.

**Real HTTP calls should NOT be performed during testing.**

https://angular.io/api/common/http/testing

_Example:_

```
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public getUserList(): Observable<any> {
    return this.http.get('https://reqres.in/api/users');
  }

  public getUserDetails(id) {
    return this.http.get(`https://reqres.in/api/users/${id}`)
      .pipe(map((data) => this.transformResponseToAddUniversity
      (data)));
  }
}

```

- [HttpClientTestingModule](https://angular.io/api/common/http/testing/HttpClientTestingModule) is imported to mock HttpClientModule because we don’t want to make actual http requests while testing the
  service.
- [HttpTestingController](https://angular.io/api/common/http/testing/HttpTestingController) is injected into tests, that allows for mocking and flushing of requests.
- [httpMock.verify()](https://angular.io/api/common/http/testing/HttpTestingController) is called after each tests to verify that there are no ongoing/pending http calls.

```
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';

const mockUserListResponse = {
  data: [
    { id: 1, first_name: 'George', last_name: 'Bluth', avatar:
        'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg' },
    { id: 2, first_name: 'Janet', last_name: 'Weaver', avatar:
        'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg' },
    { id: 3, first_name: 'Emma', last_name: 'Wong', avatar: 'https://s3.
      amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg' },
  ],
};

const mockUserDetails = {
  data: { id: 1, first_name: 'George', last_name: 'Bluth', avatar:
      'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg' },
};

const tranformedMockUserDetails = {
  data: {
    id: 1,
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden
      /128.jpg',
    university: 'MIT',
  },
};

describe('UsersService', () => {
  let injector: TestBed;
  let service: UsersService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    injector = getTestBed();
    service = injector.get(UsersService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getUserList() should return data', () => {
    service.getUserList().subscribe((res) => {
      expect(res).toEqual(mockUserListResponse);
    });
    const req = httpMock.expectOne('https://reqres.in/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUserListResponse);
  });

  it('getUserDetails() should return trasnformed data', () => {
    service.getUserDetails('1').subscribe((res) => {
      expect(res).toEqual(tranformedMockUserDetails);
    });
    const req = httpMock.expectOne('https://reqres.in/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUserDetails);
  });
});

```

It is also recommended to test an error handling, like this:

```
it('getUserDetails() should get error if request fails', () => {
  service.getUserDetails('1').subscribe(
    () => fail('should have failed'),
    (error: HttpErrorResponse) => {
      expect(error.status).toBe(500);
    });
  const req = httpMock.expectOne('https://reqres.in/api/users/1');
  expect(req.request.method).toBe('GET');
  req.flush('failed', {status: 500, statusText: 'Internal Server Error'});
});
```

---

### Components:

##### Smart Components

- Use helper functions to encapsulate logic from the rest of the application. Avoid placing logic within life cycle methods and other hooks.
- When testing components with service dependencies, always use mock services instead of real services.
- Use helper functions to encapsulate logic from the rest of the application. **Avoid placing logic within life cycle methods and other hooks.**
- Avoid referencing the component's state from within a helper method despite it being available. This will make it easier to test in isolation.

_Example:_

```
@Component({
  selector: 'gr-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public userList = [];
  public errMsg: string;
  public selectedUser = {
    first_name: '',
    last_name: '',
  };
  public fee = 0;
  constructor(public userService: UsersService) {}
  ngOnInit() {
    this.getUsers();
  }
  public getUsers(): void {
    this.userService.getUserList().subscribe(
      (res) => {
        this.userList = res.data;
      },
      (err) => {
        this.errMsg = 'Error while loading User List';
      }
    );
  }
  public getDetails(id: number): void {
    this.userService.getUserDetails(id).subscribe(
      (res) => {
        this.selectedUser = res.data;
        this.fee = this.getFeePaid(id);
      },
      (err) => {
        this.errMsg = 'Error while loading User Details';
      }
    );
  }
  public getFeePaid(id: number): number {
    return id * 1000;
  }
}
```

```
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { UsersComponent } from './users.component';
import { UsersService } from '../services/users.service';
import { UsersServiceStub } from './users.service.mock';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [UsersComponent],
      providers: [{ provide: UsersService, useClass: UsersServiceStub
      }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "userList" populated ', () => {
    expect(component.userList.length).toBeGreaterThan(0);
  });

  it('should call getUserList() of UsersService on component Init', ()
    => {
    spyOn(component.userService, 'getUserList').and.callThrough();
    component.ngOnInit();
    expect(component.userService.getUserList).toHaveBeenCalled();
  });

  it('should set Error message when getUserDetails() is errored out', ()
    => {
    expect(component.errMsg).toBeUndefined();
    spyOn(component.userService, 'getUserDetails').and.returnValue
    (throwError('Error'));
    component.getDetails(1);
    expect(component.errMsg).toBe('Error while loading User Details');
  });
});
```

##### Dumb Components

Component inputs behave just like normal properties. Changes can be tested using the fixture change detection.

_Example:_

```
class CounterComponent implements OnChanges {
  @Input() value: string;
  changeCounter: number = 0;

  @Output() valueUpdated: EventEmitter<string> = new EventEmitter<>();
  ngOnChanges() {
    changeCounter++;
  }

  updateValue( value: string ) {
    this.valueUpdated.emit( value );
  }
}
```

```
it( 'When the value input is changed, the changeCounter must be incremented by 1', () => {
  spyOn( component, 'ngOnChanges' );
  expect( component.value ).toBeUndefined();
  expect( component.changeCounter ).toEqual( 0 );

  component.value = 'First Value';
  fixture.detectChanges();
  expect( component.ngOnChanges ).toHaveBeenCalled();
  expect( component.changeCounter ).toEqual( 1 );
});

it( 'When the updateValue() method is called with a string, Then the valueUpdated output will emit with the string', () => {
  const value = 'Test Value';
  jest.spyOn( component.valueUpdated, 'emit' );
  component.updateValue( value );
  expect( component.valueUpdated.emit ).toHaveBeenCalledWith( value );
});
```

---

### Pipes

- There are two kinds of pipes: **built-in pipes** and **custom pipes**. We can unit test custom pipes since they reside in the source code.
- Both custom and built-in pipes can be tested with the component.
- While testing custom pipes, we need to import and add that pipe to declarations array. Otherwise, the Test fails.
- We don’t have to import any built-in pipes since it’s part of the angular core.

**Testing Custom Pipes (Pure)**

Since a pipe is a class that has only one method (transform, that manipulates the input value into a transformed output value), it can be tested without any Angular testing utilities.

All we need to do is to initialize the pipe, get the result with the transform method and test the result with expect assertion.

**Here is the custom pipe for it and test spec file:**

```
import{ Pipe, PipeTransform } from '@angular/core';
@Pipe({
 name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
    transform(value: number): string {
        return value.toString().replace(".", ",");
     }
}
```

```
import { FormatNumberPipe } from "./formatter.pipe";

describe('FormatNumberPipe', () => {
     it('create an instance', () => {
     const pipe = new FormatNumberPipe();
     expect(pipe).toBeTruthy();
 });

 it('should replace dot with a comma for the number', () => {
     const pipe = new FormatNumberPipe();
     const ret = pipe.transform(1.23456);
     expect(ret).toBe('1,23456');
 });

 it('should not do anything if the value is an integer number', () => {
     const pipe = new FormatNumberPipe();
     const ret = pipe.transform(999);
     expect(ret).not.toContain(',');
 });
});
```

**Testing built-in pipes (Pure)**

All built-in pipes are part of Angular core, we can only test these with the component.

<h4> Welcome to {{ title | uppercase}}! </h4>

```
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
     beforeEach(async(() => {
         TestBed.configureTestingModule({
             declarations: [
             AppComponent
             ],
         }).compileComponents();
 }));

 it('should create the app', () => {
     const fixture = TestBed.createComponent(AppComponent);
     const app = fixture.debugElement.componentInstance;
     expect(app).toBeTruthy();
 });

 it(`should have as title 'my-app-unit-testing'`, () => {
     const fixture = TestBed.createComponent(AppComponent);
     const app = fixture.debugElement.componentInstance;
     expect(app.title).toEqual('my-app-unit-testing');
 });

 it('should render title in a h4 tag in upper case', () => {
     const fixture = TestBed.createComponent(AppComponent);
     fixture.detectChanges();
     const compiled = fixture.debugElement.nativeElement;
     expect(compiled.querySelector('h4').textContent).toContain('Welcome
    to MY-APP-UNIT-TESTING!');
 });
});
```

**Testing built-in impure pipes**

```
<div class="container">
 <h2>Impure Pipe Testing</h2>
 <button type="button" (click)="add()" class="btn btn-primary">Add<
/button>
 <p>{{persons | json}}</p>
</div>

```

```
persons = [
 {firstName: 'first0', lastName: 'last0'},
 {firstName: 'first1', lastName: 'last2'},
 {firstName: 'first2', lastName: 'last3'},
 {firstName: 'first3', lastName: 'last4'}
 ]
add() {
 const len = this.persons.length;
 this.persons.push({firstName: 'first' + len, lastName: 'last' + len});
}
```

_Testing:_

```
 it('should display default persons in json fromat', () => {
     const fixture = TestBed.createComponent(AppComponent);
     // get the name's input and display elements from the DOM
     const bannerDe: DebugElement = fixture.debugElement;
     const personsHolder = bannerDe.query(By.css('p'));
     const personsEle: HTMLElement = personsHolder.nativeElement;
     fixture.detectChanges();
     const persons = [
     {firstName: 'first0', lastName: 'last0'},
     {firstName: 'first1', lastName: 'last2'},
     {firstName: 'first2', lastName: 'last3'},
     {firstName: 'first3', lastName: 'last4'}
     ];
     expect(personsEle.textContent).toMatch(JSON.stringify(persons));
 });
```

---

### Guards

```
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private _authenticationService: AuthenticationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const preventIfAuthorized: boolean = next.data['preventIfAuthorized'] as boolean;
    const redirectUrl: string = state.url && state.url !== ' /' ? state.url : null;
    return preventIfAuthorized
      ? this._authenticationService.allowIfAuthorized(redirectUrl) : this._authenticationService.allowIfNotAuthorized(redirectUrl);
  }
}
```

Here we’ll need to test the canActivate method. As usually - we need to mock any external dependencies, such as the AuthenticationService in this case.

```
describe('AuthenticationGuard', () => {

  let authenticationGuard: AuthenticationGuard;
  let mockAuthenticationService;
  let mockNext: Partial<ActivatedRouteSnapshot> = {
    data: {
      preventIfAuthorized: true,
    },
  };
  let mockState: Partial<RouterStateSnapshot> = {
    url: '/home',
  };

  beforeEach(() => {
    mockAuthenticationService = jasmine.createSpyObj
    (['allowIfAuthorized', 'allowIfNotAuthorized']);
    authenticationGuard = new AuthenticationGuard(mockAuthenticationService);
  });

  describe('Prevent Authorized Users To Routes', () => {
    beforeEach(() => {
      mockNext.data.preventIfAuthorized = true;
    });

    it('should return true to allow an authorized person to
    the route', async(() => {
    mockAuthenticationService.allowIfAuthorized.and.
    returnValue(of(true));
    authenticationGuard
      .canActivate
      (<ActivatedRouteSnapshot>mockNext, <RouterStateSnapshot>mockState)
      .subscribe((allow: boolean) => {
        expect(allow).toBe(true);
      });
  }));

  it('should return false to not allow an authorized person to the route', async(() => {
    mockAuthenticationService.allowIfAuthorized.and.
    returnValue(of(false));

    authenticationGuard
      .canActivate
      (<ActivatedRouteSnapshot>mockNext, <RouterStateSnapshot>mockState)
      .subscribe((allow: boolean) => {
        expect(allow).toBe(false);
      });
  }));
  });
}

```

---

### Directives

##### Attribute Directives

For attribute directives we can test DOM changes since the goal is to change the appearance or behavior of the view based on an event.

In the below example is the attribute directive that changes the backgroundColor of the host element on mouseover event:

```
import {
 Directive,
 HostListener,
 HostBinding
} from '@angular/core';
@Directive({
 selector: '[hoverfocus]'
})
export class HoverFocusDirective {
     @HostBinding('style.background-color') backgroundColor: string;
     @HostListener('mouseover') onHover() {
     this.backgroundColor = 'blue';
 }
 @HostListener('mouseout') onLeave() {
     this.backgroundColor = 'inherit';
 }
}
```

It is recommended to test directives in isolation from the component by creating a component’s mock

_Example:_

```
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HoverFocusDirective } from './hoverfocus.directive';
@Component({
 template: `<input type="text" hoverfocus>`
})

class TestHoverFocusComponent {
}

describe('Directive: HoverFocus', () => {
     let component: TestHoverFocusComponent;
     let fixture: ComponentFixture<TestHoverFocusComponent>;
     let inputEl: DebugElement;

     beforeEach(() => {
         TestBed.configureTestingModule({
         declarations: [TestHoverFocusComponent, HoverFocusDirective]
     });
     fixture = TestBed.createComponent(TestHoverFocusComponent);
     component = fixture.componentInstance;
     inputEl = fixture.debugElement.query(By.css('input'));
 });

 it('hovering over input', () => {
     inputEl.triggerEventHandler('mouseover', null);
     fixture.detectChanges();
     expect(inputEl.nativeElement.style.backgroundColor).toBe('blue');
     inputEl.triggerEventHandler('mouseout', null);
     fixture.detectChanges();
     expect(inputEl.nativeElement.style.backgroundColor).toBe('inherit');
 });
});
```

##### Structural Directives

[Documentation](https://angular.io/guide/structural-directives)

Structural directives are responsible to shape or reshape the DOM’s structure, typically by adding, removing, or manipulating elements. Similar to other directives, you apply a structural directive to a host element. The directive then does whatever it’s designed to do with that host element.

For example, here is a custom structural directive that iterates over objects:

```
import {Directive, Input, OnChanges, SimpleChanges, TemplateRef,
ViewContainerRef} from '@angular/core';
@Directive({
 selector: '[appNgForObject]'
})
export class NgForObjectDirective implements OnChanges {
 @Input() appNgForObjectFrom: { [key: string]: any };

 constructor(
     private templateRef: TemplateRef<any>,
     private viewContainerRef: ViewContainerRef
 ) {}

 ngOnChanges(changes: SimpleChanges): void {
    if (changes.appNgForObjectFrom && changes.appNgForObjectFrom.currentValue) {
        this.viewContainerRef.clear();
        const propertyNames = Object.keys(changes.appNgForObjectFrom.currentValue);
        propertyNames.forEach((propertyName: string, index: number) => {
            this.viewContainerRef.createEmbeddedView(this.templateRef, { $implicit: propertyName,index
            });
        });
    }
 }
}
```

To test this directive we will add a mock component with a template to a .spec file:

```
import { Component } from '@angular/core';
import { NgForObjectDirective } from './ng-for-object.directive';
import { By } from '@angular/platform-browser';
@Component({
 template: `<div *appNgForObject="
            let name from testObject; let i=index">
            [{{i}}] {{name}}: {{testObject[name]}}
            </div>`
})
class TestComponent {
     testObject = {
     a: 'one',
     b: 'two',
     c: 'three'
     };
}
```

Then we will add dependencies:

```
describe('NgForObjectDirective', () => {
 let component: TestComponent;
 let fixture: ComponentFixture<TestComponent>;
 let templateRef: TemplateRef<any>;
 let viewContainerRef: ViewContainerRef;
    beforeEach(() => {
         TestBed.configureTestingModule({
         declarations: [
         TestComponent,
         NgForObjectDirective
         ]
    });
 fixture = TestBed.createComponent(TestComponent);
 component = fixture.componentInstance;
 });
```

Then we can check that both component and directive instances are defined:

```
it('should create component', () => {
    expect(component).toBeDefined();
 });

 it('should create an instance', () => {
    const directive = new NgForObjectDirective(templateRef, viewContainerRef);
    expect(directive).toBeTruthy();
 })
```

```
it('should not render object data', () => {
     component.testObject = null;
     const div = fixture.debugElement.query(By.css('div'));
     fixture.detectChanges();
     expect(div).toBeNull();
 });
```

```
 it('should render object data', () => {
     const div = fixture.debugElement.query(By.css('.testEl'));
     fixture.detectChanges();
     expect(div).not.toBeNull();
 });
```

---

### NgRx Store

##### Reducer

In the following example, our reducer specifies what would happen when the setData action will occur. Unsurprisingly, it just sets data.

```
import * as DataActions from './data.actions';

export interface State {
  data: any;
}

export const initialState: State = {
  data: null
};

const DataReducer = createReducer(
  initialState,
  on(DataActions.setData, (state, action) => ({
    ...state,
    data: action.payload
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return DataReducer(state, action);
}
```

_Reducer unit test example:_

In our reducer, we will have 2 test cases:

- The initial state is retained for unknown actions
- The setData action

As we will set data, it is good to reset the data property from initialState to ensure it will remain the same at the very beginning of each test.
Here, we use the afterEach method.

```
import { initialState, reducer, State } from './data.reducer';
import * as DataActions from './data.actions';

describe('Store > Data > DataReducer', () => {
  afterEach(() => {
    initialState.data = null;
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('setData action', () => {
    it('SHOULD load data', () => {
      const payload: any = {
        name: 'unit-tests',
        value: 'OK'
      };
      const action = new DataActions.setData(payload);
      const state = reducer(initialState, action);

      expect(state.data).toEqual(payload);
    });
  });
});
```

##### Effects

Testing effects requires more configuration.

As we know, Effects are usually used to perform side effects like fetching data using HTTP and then they dispatch some actions.

```
  @Effect()
  getAttendees$ = this.actions$.pipe(
    ofType(AttendeesActionTypes.LoadAttendees),
    switchMap((action: LoadAttendees) =>
      this.eventService.getAttendees().pipe(
        map((attendees: Attendee[]) => new LoadAttendeesSuccess(attendees)),
        catchError(error => of(new LoadAttendeesFail(error)))
      )
    )
  );

```

As you can see in the above example, when the LoadAttendees action is called, the getAttendees() service call is made to fetch the data which further dispatches LoadAttendeesSuccess or LoadAttendeesFail action based on Http response.

All this is managed using an RxJS operator (switchMap in this case) that takes care of handling the inner and the outer observables. switchMap processes only the latest outer observable and maintains only one inner subscription at a time.

Now, do you realise that it is not so easy to test such an asynchronous behavior. There is a need to model and test RxJS observables in this case.

**But how?**

##### Let's see how Marble Testing can help:

- Marble testing provide a simple way to describe observable streams.
- They can be used to model and test observables.
- They can also be used to model and test subscriptions.
- Uses a scheduler to provide timing.
- Timing is done frame-by-frame.
- Each character in a marble is 10 frames. A frame is a virtual "millisecond" or "clock cycle" of the scheduler.
- Can model both Hot and Cold Observables.

**Syntax**

- The first character is "zero frame".
- A dash "-" represents the passage of 10 frames.
- A pipe "|" indicates completion notification.
- A hash "#" indicates error notification.
- A carrot "^" indicates subscription point in a hot observable.
- Any other character indicates next notification.

**Cold vs Hot**

- A cold observable does not produce values until there is at least one subscriber until complete or all subscribers have unsubscribed.Observables by default are cold.
- A hot observable produces values regardless of the subscribers. A good example of hot observables are mouse events, subjects, behavior subjects, replay subjects.

**Examples**

cold('--a--|'):

- Emit a value and complete.
- The mocked cold observable is a total of 60 frames.
- The letter "a" represents our first emitted value.

cold('--a--#'):

- Emit a value and error
- The mocked cold observable is a total of 60 frames.

cold('--a-b--|'):

- Emit multiple values and complete:
- The observable is 80 frames.

**We will make use of this lib [jest-marbles](https://www.npmjs.com/package/jest-marbles) for marble testing**

_Example of NgRx Effects Unit Test Using Marble Testing:_

- Import provideMockActions, provideMockStore from ngrx testing lib.
- Mock EventService.
- import { hot, cold } from 'jasmine-marbles'.
- Since LoadAttendees action should be fired without the need of any subscription, it is binded as a hot observable. This basically sets up the action to be asserted into the Actions observable stream in NgRx.
- We define the expected constant as a cold observable, which after two frames emits the outcome that is the LoadAttendeesSuccess action that we are expecting.

```
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jest-marbles';
import { Subject, of, Observable } from 'rxjs';

import { AttendeesEffects } from './attendees.effects';
import {
  LoadAttendees,
  LoadAttendeesSuccess,
  AttendeesActions
} from './attendees.actions';
import { Attendee } from '../../../models';
import { EventService } from '../../services/event.service';

describe(`Effect: Attendess`, () => {
  let actions: Observable<AttendeesActions>;
  let effects: AttendeesEffects;
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AttendeesEffects,
        provideMockActions(() => actions),
        provideMockStore()
        {
          provide: EventService,
          useValue: {
            getAttendees: jest.fn()
          }
        }
      ]
    });

    service = TestBed.get(EventService);
    effects = TestBed.get(AttendeesEffects);
  });

  it('should work', () => {
    const fakeAttendees = [
      { name: 'Duncan', attending: false, guests: 0 } as Attendee
    ];
    const action = new LoadAttendees();
    const completion = new LoadAttendeesSuccess(fakeAttendees);

    jest
      .spyOn(service, 'getAttendees')
      .mockImplementation(() => of(fakeAttendees));
    actions = hot('--a-', { a: action });
    const expected = cold('--(b)', { b: completion });
    expect(effects.getAttendees$).toBeObservable(expected);
  });
});
```

##### Selector

[Example](https://timdeschryver.dev/blog/how-i-test-my-ngrx-selectors#setting-up-test-state-with-factory-functions)

A selector is a pure function that takes the state as an argument and returns a slice of the store state.

These are the selectors which are used in the shopping cart application to get products.

```
export const getCatalogState = createFeatureSelector<fromCatalog.State>('catalog');

export const getProducts = createSelector(getCatalogState, (catalog) => catalog.products);
```

Before creating tests, let's create factory functions to set up our state before each test.

```
const createProduct = ({ name = '' } = {}): Product => ({
  name: name,
});

const createCatalogState = ({
  products = {
    'PRODUCT-AAA': createProduct({ name: 'PRODUCT-AAA' }),
    'PRODUCT-BBB': createProduct({ name: 'PRODUCT-BBB' }),
    'PRODUCT-CCC': createProduct({ name: 'PRODUCT-CCC' }),
  },
} = {}) => ({
  catalog: {
    products
  },
});
```

The unit test for this selector will be like this:

```
test('getProducts', () => {
  const state = createCatalogState();
  expect(getProducts(state)).toBe(state.catalog.products);
});
```
