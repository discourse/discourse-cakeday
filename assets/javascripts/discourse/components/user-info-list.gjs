import UserInfo from "discourse/components/user-info";
import I18n from "I18n";

function cakedayDate(val, { isBirthday }) {
  const date = moment(val);

  if (isBirthday) {
    return date.format(I18n.t("dates.full_no_year_no_time"));
  } else {
    return date.format(I18n.t("dates.full_with_year_no_time"));
  }
}

const UserInfoList = <template>
  <ul class="user-info-list">
    {{#each @users as |user|}}
      <li class="user-info-item">
        <UserInfo @user={{user}}>
          <div>{{cakedayDate user.cakedate isBirthday=@isBirthday}}</div>
        </UserInfo>
      </li>
    {{else}}
      <div class="user-info-empty-message"><h4>{{yield}}</h4></div>
    {{/each}}
  </ul>
</template>;

export default UserInfoList;
