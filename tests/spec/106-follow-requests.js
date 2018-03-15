import { foobarRole } from '../roles'
import {
  accountProfileFollowButton,
  getNthStatus,
  sleep
} from '../utils'
import {
  authorizeFollowRequestAsLockedAccount, getFollowRequestsAsLockedAccount
} from '../serverActions'

fixture`106-follow-requests.js`
  .page`http://localhost:4002`

test('can request to follow an account', async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/6')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow (follow requested)')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow (follow requested)')

  let requests = await getFollowRequestsAsLockedAccount()
  await authorizeFollowRequestAsLockedAccount(requests.slice(-1)[0].id)

  await sleep(2000)

  await t.navigateTo('/accounts/6')
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(getNthStatus(0).innerText).contains('This account is locked')
    .click(accountProfileFollowButton)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
})