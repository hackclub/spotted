# frozen_string_literal: true

module Api::V1
  class ApiController < ::ApplicationController
    skip_before_action :verify_authenticity_token
    def current_resource_owner
      User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
    end
  end
end
