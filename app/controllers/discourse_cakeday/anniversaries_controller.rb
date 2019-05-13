# frozen_string_literal: true

module DiscourseCakeday
  class AnniversariesController < CakedayController
    PAGE_SIZE = 48

    def index
      users = User.valid
        .where("EXTRACT(YEAR FROM (users.created_at - interval ':offset hour')) != :year",
          offset: @offset,
          year: @today.year
        )

      users =
        case params[:filter]
        when 'today', 'tomorrow'
          users
            .where(
              "to_char(users.created_at - interval ':offset hour', 'MM-DD') = :date",
              offset: @offset,
              date: (params[:filter] == 'today' ? @today : @tomorrow).strftime('%m-%d')
            )
            .order_by_likes_received
        when 'upcoming'
          from = @tomorrow + 1.day
          to = from + 1.week

          users
            .where(
              "to_char(users.created_at - interval ':offset hour', 'MM-DD') IN (:dates)",
              offset: @offset,
              dates: (from.to_date..to.to_date).map { |date| date.strftime('%m-%d') }
            )
            .order("EXTRACT(MONTH FROM users.created_at - interval '#{@offset.to_i} hour') ASC")
            .order("EXTRACT(DAY FROM users.created_at - interval '#{@offset.to_i} hour') ASC")
            .order_by_likes_received
        else
          users
            .where("EXTRACT(MONTH FROM (users.created_at - interval ':offset hour')) = :month",
              offset: @offset,
              month: @month
            )
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
          filter: params[:filter],
          timezone_offset: params[:timezone_offset]
        )
      )
    end
  end
end
