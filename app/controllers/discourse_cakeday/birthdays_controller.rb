# frozen_string_literal: true

module DiscourseCakeday
  class BirthdaysController < CakedayController
    before_action :ensure_cakeday_birthday_enabled

    PAGE_SIZE = 48

    def index
      users = User.valid

      users =
        case params[:filter]
        when 'today', 'tomorrow'
          users
            .where(
              "to_char(users.date_of_birth::date, 'MM-DD') = :date",
              date: (params[:filter] == 'today' ? @today : @tomorrow).strftime('%m-%d')
            )
            .order_by_likes_received
        when 'upcoming'
          from = @tomorrow + 1.day
          to = from + 1.week

          users
            .where(
              "to_char(users.date_of_birth::date, 'MM-DD') IN (?)",
              (from.to_date..to.to_date).map { |date| date.strftime('%m-%d') }
            )
            .order("EXTRACT(MONTH FROM users.date_of_birth::date) ASC")
            .order("EXTRACT(DAY FROM users.date_of_birth::date) ASC")
            .order_by_likes_received
        else
          users
            .where("EXTRACT(MONTH FROM users.date_of_birth::date) = ?", @month)
            .order("EXTRACT(MONTH FROM users.date_of_birth::date) ASC")
            .order("EXTRACT(DAY FROM users.date_of_birth::date) ASC")
            .order_by_likes_received
        end

      total_rows_count = users.count
      users = users.limit(PAGE_SIZE).offset(PAGE_SIZE * @page)

      render_json_dump(
        birthdays: serialize_data(users, BirthdayUserSerializer),
        total_rows_birthdays: total_rows_count,
        load_more_birthdays: birthdays_path(
          page: @page + 1,
          month: params[:month],
          filter: params[:filter]
        )
      )
    end

    private

    def ensure_cakeday_birthday_enabled
      raise Discourse::NotFound if !SiteSetting.cakeday_birthday_enabled
    end
  end
end
