import {Selector, ClientFunction} from 'testcafe'

fixture('Getting Started').page('http://192.168.1.24:5173//Reservation/1')

test('Test About page route', async test =>{
    const getLocation = ClientFunction(() => document.location.href)
    await test.click('#Navbar > nav > ul > li:nth-child(2) > a')
        .expect(getLocation()).eql('http://192.168.1.24:5173/about')
});

