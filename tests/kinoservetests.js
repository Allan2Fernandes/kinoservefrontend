import {Selector, ClientFunction} from 'testcafe'

fixture('Getting Started').page('http://localhost:5173/Reservation/1')

test('Test About page route', async test =>{
    //const getLocation = ClientFunction(() => document.location.href)
    await test.typeText('#inputId', "allan")
});