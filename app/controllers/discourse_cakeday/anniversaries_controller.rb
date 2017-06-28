module DiscourseCakeday
  class AnniversariesController < CakedayController
    PAGE_SIZE = 48

    def index
      users =
        case params[:filter]
        when 'today'
          User.anniversary_month(@current_month)
            .where(
              "EXTRACT(DAY FROM users.created_at::date) = ?", @today.day
            )
            .order_by_likes_received
        when 'upcoming'
          User.real
            .activated
            .where(
              "to_char(users.created_at::date, 'MM-DD') IN (?)",
              (@tomorrow..@week_from_now).map { |date| date.strftime('%m-%d') }
            )
            .order("EXTRACT(MONTH FROM users.created_at::date) ASC")
            .order("EXTRACT(DAY FROM users.created_at::date) ASC")
            .order_by_likes_received
        else
          User.anniversary_month(@month)
            .order("users.created_at ASC")
            .order_by_likes_received
        end

      total_rows_count = users.count
      users = select_fields(users).limit(PAGE_SIZE).offset(PAGE_SIZE * @page)

      render_json_dump(
        anniversaries: serialize_data(users, AnniversaryUserSerializer),
        total_rows_anniversaries: total_rows_count,
        load_more_anniversaries: anniversaries_path(
          page: @page + 1,
          month: params[:month],
          filter: params[:filter]
        )
      )
    end
  end
end
