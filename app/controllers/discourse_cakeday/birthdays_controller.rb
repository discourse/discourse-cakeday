module DiscourseCakeday
  class BirthdaysController < CakedayController
    PAGE_SIZE = 48

    def index
      users = User.valid

      users =
        case params[:filter]
        when 'today'
          users
            .where("EXTRACT(MONTH FROM users.date_of_birth::date) = ?", @current_month)
            .where("EXTRACT(DAY FROM users.date_of_birth::date) = ?", @today.day)
            .order_by_likes_received
        when 'upcoming'
          users
            .where(
              "to_char(users.date_of_birth::date, 'MM-DD') IN (?)",
              (@tomorrow.to_date..@week_from_now.to_date).map { |date| date.strftime('%m-%d') }
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
  end
end
