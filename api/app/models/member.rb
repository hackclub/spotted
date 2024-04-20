# frozen_string_literal: true

class Member < ApplicationRecord
  belongs_to :user
  belongs_to :team

  validates :user, :team, presence: true
end
