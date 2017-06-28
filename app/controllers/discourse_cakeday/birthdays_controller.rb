module DiscourseCakeday
  class BirthdaysController < CakedayController
    PAGE_SIZE = 48

    def index
      users =
        case params[:filter]
        when 'today'
          User.birthday_month(@current_month)
            .order_by_likes_received
            .where("EXTRACT(MONTH FROM users.date_of_birth::date) = ?", @today.month)
            .where("EXTRACT(DAY FROM users.date_of_birth::date) = ?", @today.day)
        when 'upcoming'
          User.real
            .activated
            .where(
              "to_char(users.date_of_birth::date, 'MM-DD') IN (?)",
              (@tomorrow..@week_from_now).map { |date| date.strftime('%m-%d') }
            )
            .order("EXTRACT(MONTH FROM users.date_of_birth::date) ASC")
            .order("EXTRACT(DAY FROM users.date_of_birth::date) ASC")
            .order_by_likes_received
        else
          User.birthday_month(@month)
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
  end
end
