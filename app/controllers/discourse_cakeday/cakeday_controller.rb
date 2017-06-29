module DiscourseCakeday
  class CakedayController < ::ApplicationController
    before_filter :ensure_logged_in
    before_action :setup_params

    private

    def setup_params
      @page = params[:page].to_i
      @month = params[:month].to_i

      @offset = (params[:timezone_offset].to_i || 0) / 60
      @today = Time.zone.now - @offset.hours
      @current_month = @today.month
      @tomorrow = @today + 1.day
      @week_from_now = @today + 1.week
    end

    def select_fields(users)
      users.select(:id, :username, :name, :title, :uploaded_avatar_id, :date_of_birth, :created_at)
    end
  end
end
